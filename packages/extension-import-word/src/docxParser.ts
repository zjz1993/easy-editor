/**
 * Custom .docx -> HTML parser.
 *
 * Replaces mammoth for this package. mammoth by design strips direct character
 * formatting (color, highlight, font), which loses user intent on import.
 *
 * Scope:
 *   - Paragraphs (`<p>`), headings (`<h1>`-`<h6>`), Title (-> `<h1>`)
 *   - Lists via `word/numbering.xml` (bullet -> `<ul>`, decimal/letter/roman
 *     -> `<ol>`); nesting tracked via `<w:ilvl>`
 *   - Tables (basic; merged cells not specially handled)
 *   - Runs with bold / italic / underline / strike / color / highlight
 *   - Inline images via DrawingML (`<w:drawing>`) and legacy VML (`<w:pict>`)
 *     with width / height emitted from `<wp:extent>` (EMU -> px) and
 *     fallback to intrinsic pixels via `image-meta`.
 *   - Hyperlinks via `<w:hyperlink r:id>`
 *
 * Out of scope: footnotes, comments, complex drawing shapes, charts,
 * mathematical equations, smart art, intricate list numbering overrides.
 */

import JSZip from 'jszip';
import { imageMeta } from 'image-meta';

import type { DocxToHTMLOptions, MammothImage } from './types';

const RELS_NS =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

interface ListStackEntry {
  tag: 'ul' | 'ol';
  level: number;
}

class DocxParser {
  private readonly zip: JSZip;
  private readonly domParser = new DOMParser();
  private readonly options?: DocxToHTMLOptions;

  /** rId -> media path inside the zip (e.g. "word/media/image1.png"). */
  private readonly rels = new Map<string, string>();
  /** numId -> abstractNumId. */
  private readonly numIdToAbstract = new Map<number, number>();
  /** abstractNumId -> (ilvl -> numFmt). */
  private readonly abstractNumLevels = new Map<number, Map<number, string>>();
  /** rId -> ready-to-emit `<img>` HTML string (filled by image pre-pass). */
  private readonly imageEls = new Map<string, string>();
  /** Open list stack while emitting, to balance `<ul>`/`<ol>` correctly. */
  private readonly listStack: ListStackEntry[] = [];

  constructor(zip: JSZip, options?: DocxToHTMLOptions) {
    this.zip = zip;
    this.options = options;
  }

  async parse(): Promise<string> {
    await this.loadRelationships();
    await this.loadNumbering();

    const docXml = await this.readText('word/document.xml');
    if (!docXml) throw new Error('word/document.xml not found in .docx');

    const doc = this.domParser.parseFromString(docXml, 'application/xml');
    const body = this.firstByLocal(doc.documentElement, 'body');
    if (!body) return '';

    // Pre-load all images so synchronous emission during walk can use them.
    await this.preloadImages(body);

    const out: string[] = [];
    for (const child of Array.from(body.children)) {
      const local = child.localName;
      if (local === 'p') {
        out.push(this.parseParagraph(child));
      } else if (local === 'tbl') {
        out.push(this.parseTable(child));
      }
    }
    this.closeAllLists(out);
    return out.join('');
  }

  // --- zip helpers ------------------------------------------------------

  private async readText(path: string): Promise<string | undefined> {
    const f = this.zip.file(path);
    if (!f) return undefined;
    return f.async('string');
  }

  // --- relationships ----------------------------------------------------

  private async loadRelationships(): Promise<void> {
    const xml = await this.readText('word/_rels/document.xml.rels');
    if (!xml) return;
    const doc = this.domParser.parseFromString(xml, 'application/xml');
    const rels = doc.getElementsByTagName('Relationship');
    for (let i = 0; i < rels.length; i++) {
      const rel = rels[i];
      const id = rel.getAttribute('Id');
      const target = rel.getAttribute('Target');
      if (!id || !target) continue;
      const normalized = target.startsWith('/')
        ? target.slice(1)
        : target.startsWith('word/')
          ? target
          : `word/${target}`;
      this.rels.set(id, normalized);
    }
  }

  // --- numbering --------------------------------------------------------

  private async loadNumbering(): Promise<void> {
    const xml = await this.readText('word/numbering.xml');
    if (!xml) return;
    const doc = this.domParser.parseFromString(xml, 'application/xml');

    const nums = doc.getElementsByTagName('w:num');
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const numId = Number.parseInt(num.getAttribute('w:numId') || '0', 10);
      const absRef = this.firstByLocal(num, 'abstractNumId');
      const val = absRef?.getAttribute('w:val');
      if (val != null) {
        this.numIdToAbstract.set(numId, Number.parseInt(val, 10));
      }
    }

    const abstractNums = doc.getElementsByTagName('w:abstractNum');
    for (let i = 0; i < abstractNums.length; i++) {
      const abs = abstractNums[i];
      const absId = Number.parseInt(abs.getAttribute('w:abstractNumId') || '0', 10);
      const levels = new Map<number, string>();
      const lvlEls = abs.getElementsByTagName('w:lvl');
      for (let j = 0; j < lvlEls.length; j++) {
        const lvl = lvlEls[j];
        if (lvl.parentElement !== abs) continue;
        const ilvl = Number.parseInt(lvl.getAttribute('w:ilvl') || '0', 10);
        const numFmt =
          this.firstByLocal(lvl, 'numFmt')?.getAttribute('w:val') || 'bullet';
        levels.set(ilvl, numFmt);
      }
      this.abstractNumLevels.set(absId, levels);
    }
  }

  private getListType(numId: number, ilvl: number): 'ul' | 'ol' {
    const absId = this.numIdToAbstract.get(numId);
    if (absId == null) return 'ul';
    const levels = this.abstractNumLevels.get(absId);
    const fmt = levels?.get(ilvl) || 'bullet';
    switch (fmt) {
      case 'decimal':
      case 'lowerLetter':
      case 'upperLetter':
      case 'lowerRoman':
      case 'upperRoman':
        return 'ol';
      default:
        return 'ul';
    }
  }

  // --- list stack management -------------------------------------------

  private closeList(out: string[]): void {
    const top = this.listStack.pop();
    if (top) out.push(`</${top.tag}>`);
  }

  private closeAllLists(out: string[]): void {
    while (this.listStack.length) this.closeList(out);
  }

  /**
   * Drive the list stack so it is open at exactly `targetLevel` after return,
   * emitting `<ul>`/`<ol>` open and close tags as needed. The tag chosen for
   * the current item is `tag`; deeper levels reuse the existing stack tag.
   */
  private adjustListStack(
    targetLevel: number,
    tag: 'ul' | 'ol',
    out: string[],
  ): void {
    while (
      this.listStack.length > 0 &&
      this.listStack[this.listStack.length - 1].level > targetLevel
    ) {
      this.closeList(out);
    }
    while (
      this.listStack.length === 0 ||
      this.listStack[this.listStack.length - 1].level < targetLevel
    ) {
      const newLevel = this.listStack.length
        ? this.listStack[this.listStack.length - 1].level + 1
        : 0;
      const newTag = newLevel === targetLevel ? tag : 'ul';
      this.listStack.push({ tag: newTag, level: newLevel });
      out.push(`<${newTag}>`);
    }
    const top = this.listStack[this.listStack.length - 1];
    if (top.level === targetLevel && top.tag !== tag) {
      this.closeList(out);
      this.listStack.push({ tag, level: targetLevel });
      out.push(`<${tag}>`);
    }
  }

  // --- paragraph / run / table -----------------------------------------

  private parseParagraph(p: Element): string {
    const pPr = this.firstByLocal(p, 'pPr');
    const pStyle =
      this.firstByLocal(pPr, 'pStyle')?.getAttribute('w:val') || '';
    const numPr = this.firstByLocal(pPr, 'numPr');

    const inner: string[] = [];
    for (const child of Array.from(p.children)) {
      const local = child.localName;
      if (local === 'r') {
        inner.push(this.parseRun(child));
      } else if (local === 'hyperlink') {
        inner.push(this.parseHyperlink(child));
      }
    }
    const innerHtml = inner.join('');

    // List item
    if (numPr) {
      const ilvl =
        Number.parseInt(
          this.firstByLocal(numPr, 'ilvl')?.getAttribute('w:val') || '0',
          10,
        ) || 0;
      const numId =
        Number.parseInt(
          this.firstByLocal(numPr, 'numId')?.getAttribute('w:val') || '0',
          10,
        ) || 0;
      // numId=0 means "explicitly no list" in Word.
      if (numId !== 0) {
        const tag = this.getListType(numId, ilvl);
        const out: string[] = [];
        this.adjustListStack(ilvl, tag, out);
        out.push(`<li>${innerHtml}</li>`);
        return out.join('');
      }
    }

    // Non-list paragraph closes any open list context.
    const out: string[] = [];
    this.closeAllLists(out);

    const headingMatch = /^Heading(\d+)$/.exec(pStyle) || /^heading(\d+)$/i.exec(pStyle);
    if (headingMatch) {
      const level = Math.min(6, Math.max(1, Number.parseInt(headingMatch[1], 10)));
      out.push(`<h${level}>${innerHtml}</h${level}>`);
      return out.join('');
    }
    if (pStyle === 'Title') {
      out.push(`<h1>${innerHtml}</h1>`);
      return out.join('');
    }

    out.push(`<p>${innerHtml}</p>`);
    return out.join('');
  }

  private parseHyperlink(hyperlink: Element): string {
    const rId =
      hyperlink.getAttribute('r:id') ||
      hyperlink.getAttributeNS(RELS_NS, 'id') ||
      '';
    const target = this.rels.get(rId) || '';
    const inner: string[] = [];
    for (const child of Array.from(hyperlink.children)) {
      if (child.localName === 'r') inner.push(this.parseRun(child));
    }
    const href = escapeAttr(target);
    return `<a href="${href}">${inner.join('')}</a>`;
  }

  private parseRun(r: Element): string {
    const rPr = this.firstByLocal(r, 'rPr');
    const bold = !!this.firstByLocal(rPr, 'b');
    const italic = !!this.firstByLocal(rPr, 'i');
    const underline = !!this.firstByLocal(rPr, 'u');
    const strike = !!this.firstByLocal(rPr, 'strike');
    const colorVal = this.firstByLocal(rPr, 'color')?.getAttribute('w:val');
    const color = parseColor(colorVal);
    const highlightVal =
      this.firstByLocal(rPr, 'highlight')?.getAttribute('w:val') || '';
    const highlight =
      highlightVal && highlightVal !== 'auto'
        ? wordHighlightToCss(highlightVal)
        : null;

    const parts: string[] = [];
    for (const child of Array.from(r.children)) {
      const local = child.localName;
      if (local === 't') {
        parts.push(escapeHtml(child.textContent || ''));
        // preserve inter-run whitespace
        if (child.getAttribute('xml:space') === 'preserve') {
          // already included via textContent
        }
      } else if (local === 'tab') {
        parts.push('&nbsp;&nbsp;&nbsp;&nbsp;');
      } else if (local === 'br') {
        parts.push('<br/>');
      } else if (local === 'drawing' || local === 'pict') {
        const img = this.emitImageForNode(child);
        if (img) parts.push(img);
      }
    }

    let html = parts.join('');
    if (!html) return '';

    const styles: string[] = [];
    if (color) styles.push(`color:${color}`);
    if (highlight) styles.push(`background-color:${highlight}`);
    if (styles.length) {
      html = `<span style="${styles.join(';')}">${html}</span>`;
    }
    if (bold) html = `<strong>${html}</strong>`;
    if (italic) html = `<em>${html}</em>`;
    if (underline) html = `<u>${html}</u>`;
    if (strike) html = `<s>${html}</s>`;
    return html;
  }

  private parseTable(tbl: Element): string {
    const out: string[] = [];
    this.closeAllLists(out);

    const rows: string[] = [];
    for (const tr of directChildrenByLocal(tbl, 'tr')) {
      const cells: string[] = [];
      for (const tc of directChildrenByLocal(tr, 'tc')) {
        const cellInner: string[] = [];
        for (const c of Array.from(tc.children)) {
          if (c.localName === 'p') cellInner.push(this.parseParagraph(c));
        }
        this.closeAllLists(cellInner);
        cells.push(`<td>${cellInner.join('')}</td>`);
      }
      rows.push(`<tr>${cells.join('')}</tr>`);
    }
    out.push(`<table><tbody>${rows.join('')}</tbody></table>`);
    return out.join('');
  }

  // --- image pre-pass ---------------------------------------------------

  private async preloadImages(body: Element): Promise<void> {
    const nodes: Element[] = [];
    body.querySelectorAll?.('drawing, pict')?.forEach((n) => {
      if (n instanceof Element) nodes.push(n);
    });
    // Fallback for environments where querySelectorAll is missing on the
    // DOMParser document; collect manually by walking.
    if (nodes.length === 0) {
      collectByLocalDeep(body, ['drawing', 'pict'], nodes);
    }

    await Promise.all(nodes.map((n) => this.loadImageForNode(n)));
  }

  private async loadImageForNode(node: Element): Promise<void> {
    const blip = firstByLocalDeep(node, 'blip');
    const vml = firstByLocalDeep(node, 'imagedata');
    const rId =
      blip?.getAttribute('r:embed') ||
      blip?.getAttributeNS(RELS_NS, 'embed') ||
      vml?.getAttribute('r:id') ||
      vml?.getAttributeNS(RELS_NS, 'id') ||
      '';
    if (!rId) return;

    const target = this.rels.get(rId);
    if (!target) return;

    const imgFile = this.zip.file(target);
    if (!imgFile) return;
    const buffer = await imgFile.async('arraybuffer');
    const contentType = guessContentType(target);

    // Extent (DrawingML): cx/cy in EMUs. 9525 EMU = 1px @ 96dpi.
    const extent = firstByLocalDeep(node, 'extent');
    let widthPx: number | undefined;
    let heightPx: number | undefined;
    if (extent) {
      const cx = Number.parseInt(extent.getAttribute('cx') || '0', 10);
      const cy = Number.parseInt(extent.getAttribute('cy') || '0', 10);
      if (cx) widthPx = Math.round(cx / 9525);
      if (cy) heightPx = Math.round(cy / 9525);
    }

    let src: string;
    if (this.options?.convertImage) {
      const mammothImage: MammothImage = {
        contentType,
        readAsBase64String: () => arrayBufferToBase64(buffer),
        readAsArrayBuffer: () => Promise.resolve(buffer),
      };
      const result = await this.options.convertImage(mammothImage);
      src = result.src;
    } else {
      const base64 = await arrayBufferToBase64(buffer);
      src = `data:${contentType};base64,${base64}`;
    }

    // Fallback intrinsic dims from image bytes.
    if (!widthPx || !heightPx) {
      try {
        const meta = imageMeta(new Uint8Array(buffer));
        if (meta.width) widthPx = widthPx ?? meta.width;
        if (meta.height) heightPx = heightPx ?? meta.height;
      } catch {
        // ignore
      }
    }

    const attrs: Record<string, string> = { src };
    if (widthPx) attrs.width = String(widthPx);
    if (heightPx) attrs.height = String(heightPx);
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
      .join(' ');
    this.imageEls.set(rId, `<img ${attrStr} />`);
  }

  private emitImageForNode(node: Element): string | null {
    const blip = firstByLocalDeep(node, 'blip');
    const vml = firstByLocalDeep(node, 'imagedata');
    const rId =
      blip?.getAttribute('r:embed') ||
      blip?.getAttributeNS(RELS_NS, 'embed') ||
      vml?.getAttribute('r:id') ||
      vml?.getAttributeNS(RELS_NS, 'id') ||
      '';
    if (!rId) return null;
    return this.imageEls.get(rId) || null;
  }

  // --- generic helpers --------------------------------------------------

  private firstByLocal(
    parent: Element | null | undefined,
    localName: string,
  ): Element | null {
    if (!parent) return null;
    for (const c of Array.from(parent.children)) {
      if (c.localName === localName) return c;
    }
    return null;
  }
}

// --- module-level helpers ----------------------------------------------

function directChildrenByLocal(parent: Element, localName: string): Element[] {
  const out: Element[] = [];
  for (const c of Array.from(parent.children)) {
    if (c.localName === localName) out.push(c);
  }
  return out;
}

function firstByLocalDeep(root: Element, localName: string): Element | null {
  if (root.localName === localName) return root;
  for (const c of Array.from(root.children)) {
    const hit = firstByLocalDeep(c, localName);
    if (hit) return hit;
  }
  return null;
}

function collectByLocalDeep(
  root: Element,
  names: string[],
  out: Element[],
): void {
  if (names.includes(root.localName)) out.push(root);
  for (const c of Array.from(root.children)) collectByLocalDeep(c, names, out);
}

function parseColor(val: string | null | undefined): string | null {
  if (!val) return null;
  if (val.toLowerCase() === 'auto') return null;
  if (!/^[0-9a-fA-F]{6}$/.test(val)) return null;
  return `#${val.toUpperCase()}`;
}

function wordHighlightToCss(name: string): string {
  const map: Record<string, string> = {
    yellow: '#FFFF00',
    green: '#00FF00',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    blue: '#0000FF',
    red: '#FF0000',
    darkBlue: '#00008B',
    darkCyan: '#008B8B',
    darkGreen: '#006400',
    darkMagenta: '#8B008B',
    darkRed: '#8B0000',
    darkYellow: '#FFD700',
    darkGray: '#A9A9A9',
    lightGray: '#D3D3D3',
    black: '#000000',
    white: '#FFFFFF',
  };
  return map[name] || name;
}

function guessContentType(path: string): string {
  const ext = path.toLowerCase().split('.').pop() || '';
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;');
}

function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunk) {
      const slice = bytes.subarray(i, i + chunk);
      binary += String.fromCharCode.apply(
        null,
        Array.from(slice) as unknown as number[],
      );
    }
    try {
      resolve(btoa(binary));
    } catch (err) {
      reject(err);
    }
  });
}

export async function parseDocx(
  arrayBuffer: ArrayBuffer,
  options?: DocxToHTMLOptions,
): Promise<string> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DocxParser(zip, options);
  return parser.parse();
}
