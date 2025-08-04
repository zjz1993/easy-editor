export type ImageNodeAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  textAlign?: 'center' | 'left' | 'right';
  id?: string;
  hasBorder?: boolean;
  loading?: boolean;
  loadingProgress?: number;
  tempFile?: any;
};

export type ImageOptions = {
  inline: boolean;

  allowBase64: boolean;

  HTMLAttributes: Record<string, any>;
  minWidth: number;
};
