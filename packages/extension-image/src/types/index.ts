export type ImageNodeAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  textAlign?: 'center' | 'left' | 'right';
  id?: string;
  hasBorder?: boolean;
};

export type ImageOptions = {
  inline: boolean;

  allowBase64: boolean;

  HTMLAttributes: Record<string, any>;
  minWidth: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (obj: ImageNodeAttributes) => ReturnType;
      updateAttrs: (obj: ImageNodeAttributes) => ReturnType;
      updateImageById: (id: string, attrs: ImageNodeAttributes) => ReturnType;
    };
  }
}
