interface TreeProps {
  data: TreeNodeProps[];
}

interface TreeNodeProps {
  label: string;
  children?: TreeNodeProps[];
}
export type { TreeProps, TreeNodeProps };
