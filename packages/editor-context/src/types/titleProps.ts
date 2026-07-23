export interface ITitleProps {
  title: string;
  onTitleChange: (title: string | undefined) => void;
  canEditTitle: boolean;
  showTitle: boolean;
  maxLength: number;
  autoFocus: boolean;
  onFocus: () => void;
  onBlur: () => void;
  titlePlaceholder: string;
}
