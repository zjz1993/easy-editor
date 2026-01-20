# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Easy Editor is a modular rich text editor built on top of Tiptap, structured as a TypeScript monorepo using pnpm workspaces. The project uses a plugin-based architecture where each feature is isolated in its own package, allowing for customizable and extensible editor functionality.

## Development Commands

### Build and Clean
```bash
# Clean all package dist folders
pnpm clean

# Build all packages
pnpm build

# Start the demo application (dev/editor-demo)
pnpm start
```

### Per-Package Commands
Each package has these standard scripts:
- `pnpm run clean` - Clean dist and .turbo folders
- `pnpm run dev` - Watch mode for development (uses tsup with --watch)
- `pnpm run build` - Production build

### Running Specific Tasks
```bash
# Build a specific package
pnpm --filter @easy-editor/editor-name build

# Run dev mode for a specific package
pnpm --filter @easy-editor/editor-name dev
```

## Monorepo Structure

### Package Categories

**Core Editor Packages:**
- `@easy-editor/editor` (packages/editor-main) - Main editor component that composes all extensions
- `@easy-editor/editor-context` (packages/editor-context) - React context for state management and props distribution
- `@easy-editor/editor-common` (packages/editor-common) - Shared utilities, constants, hooks, and components
- `@easy-editor/editor-toolbar` (packages/editor-toolbar) - Modular toolbar component
- `@easy-editor/editor-style` (packages/editor-style) - Shared SCSS styles

**Extension Packages:**
- `@easy-editor/extension-bold` - Bold text formatting
- `@easy-editor/extension-code-block` - Code blocks with language detection
- `@easy-editor/extension-image` - Image insertion and handling
- `@easy-editor/extension-indent` - Text indentation support
- `@easy-editor/extension-link` - Hyperlink support
- `@easy-editor/extension-outline` - Document outline/navigation
- `@easy-editor/extension-table` - Table creation and editing with bubble menus
- `@easy-editor/extension-task-item` - Task lists and checkboxes

**Demo Application:**
- `editor-demo` (dev/editor-demo) - Vite-based demo app for testing the editor

### Build System

The project uses:
- **tsup** for building individual packages (ESM-only, no CommonJS)
- **Turbo** for monorepo task orchestration with dependency ordering
- **pnpm** (v9.13.0) as the package manager with workspace protocol
- **esbuild-sass-plugin** for SCSS compilation

All packages build to ESM format only. React and Tiptap are externalized as peer dependencies to avoid bundling them.

### Build Configuration

Each package extends the base tsup configuration (`tsup.config.base.ts`):
- Entry: `src/index.ts`
- Output: ESM with TypeScript declarations
- External dependencies: React, React DOM, Tiptap packages, and internal @easy-editor/* packages
- Platform: browser
- Target: ES2018
- SCSS compilation via esbuild-sass-plugin
- Images embedded as data URLs

## Architecture Patterns

### Extension Composition

The main editor (`packages/editor-main/src/root.tsx`) composes all extensions:
1. Base extensions from Tiptap StarterKit (with some features disabled)
2. Custom extensions from @easy-editor packages
3. Extensions are wrapped with `wrapBlockExtensions()` utility for consistency
4. Extension names are defined as constants in `BLOCK_TYPES` from @easy-editor/editor-common

### State Management

- `EditorProvider` from @easy-editor/context wraps the entire editor
- Props are managed through React context and distributed to child components
- Custom hooks provide access to editor instance and props:
  - `useEditorInstance()` - Access the Tiptap editor instance
  - `useEditorProps()` - Access editor props with defaults merged
  - `useTiptapWithSync()` - Sync editor with external props changes

### Extension Package Pattern

Each extension follows this structure:
```
packages/extension-name/
├── src/
│   ├── index.ts          # Re-exports
│   └── extension-name.ts # Implementation
├── package.json
└── tsup.config.ts        # Extends base config
```

Extensions typically:
1. Extend Tiptap base extensions
2. Export a single default export (the configured extension)
3. Have minimal peer dependencies (@tiptap/core and specific Tiptap extensions)

### Toolbar Architecture

The toolbar is modular and composable:
- Each formatting button is a separate component
- Uses rc-overflow for handling overflow scenarios
- Toolbar state updates dynamically based on editor state
- Buttons are conditionally rendered based on active marks/nodes

### Block Type Constants

All block types are defined in `@easy-editor/editor-common` as constants:
- Used for extension configuration and content matching
- Examples: `P`, `H`, `UL`, `OL`, `QUOTE`, `IMG`, `TABLE`, etc.
- Critical for extension configuration and list handling

## Key Conventions

### Package.json Configuration
- Use `workspace:^` for internal dependencies
- Externalize React and Tiptap as peer dependencies
- Set `sideEffects: false` for extensions
- Export ESM only via `module` field (no `main`/CJS)

### Extension Development
When creating new extensions:
1. Create package in `packages/extension-name/`
2. Extend appropriate Tiptap base extension
3. Add to `@easy-editor/editor` dependencies
4. Import and add to extensions array in `packages/editor-main/src/root.tsx`
5. Follow the pattern of existing extensions (see extension-bold for simple example)

### Styling
- Styles are in SCSS format
- Compiled during build via esbuild-sass-plugin
- Shared styles in @easy-editor/editor-style
- Each package can have its own styles

### TypeScript
- Strict typing throughout
- Export types alongside implementations
- Use `FC` from React for function components
- Define clear interfaces for props

## Testing Changes

After making changes:
1. Build affected packages: `pnpm --filter @easy-editor/package-name build`
2. Or build all: `pnpm build`
3. Test with demo app: `pnpm start`

## Important Notes

- The project uses ESM exclusively - no CommonJS support
- Always use workspace protocol (`workspace:^`) for internal dependencies
- Extension names must match BLOCK_TYPES constants when configuring
- The editor uses custom list implementations that differ from Tiptap defaults
- Table editing includes custom bubble menus for better UX
- Images are embedded as data URLs during build
