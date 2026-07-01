interface TreeProps {
  data: TreeNodeProps[];
  /** Currently active heading key (pos as string) */
  activeKey?: string | null;
  /** Set of expanded node keys */
  expandedKeys: Set<string>;
  /** Called when a label is clicked (scroll to heading) */
  onSelect?: (key: string) => void;
  /** Called when expand/collapse arrow is toggled */
  onToggle?: (key: string) => void;
}

interface TreeNodeProps {
  /** Stable business id (heading pos as string). NOT named `key` to avoid React reserved prop collision. */
  id: string;
  label: string;
  children?: TreeNodeProps[];
}

export type { TreeProps, TreeNodeProps };
