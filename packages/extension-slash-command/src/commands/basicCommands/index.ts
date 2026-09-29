import type {SlashItem} from '../../types';
import {toggleHeadingCommand} from '@textory/editor-utils';

export const basicCommands: SlashItem[] = [
  ...([1, 2, 3] as const).map<SlashItem>((level) => ({
    id: `heading-${level}`,
    titleKey: 'header.level',
    titleValues: {level},
    keywords: [`h${level}`, 'heading'],
    command: ({editor, range}) => {
      toggleHeadingCommand({editor, level, range});
    },
  })),
];
