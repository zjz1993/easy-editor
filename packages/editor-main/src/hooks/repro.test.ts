import {describe, expect, it} from 'vitest';
import StarterKit from '@tiptap/starter-kit';
import {Editor} from '@tiptap/core';

describe('repro', () => {
  it('StarterKit editor in happy-dom', () => {
    const editor = new Editor({extensions: [StarterKit], content: '<h1>t</h1>'});
    expect(editor.getHTML()).toContain('t');
    editor.destroy();
  });
});
