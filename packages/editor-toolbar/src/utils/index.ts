import { isWindows } from '@easy-editor/editor-common';

export const command = isWindows() ? 'Ctrl' : '⌘';

export const option = isWindows() ? 'Alt' : 'Option';
