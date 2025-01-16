import { type NodeViewProps } from '@tiptap/react';
import { type FC } from 'react';
import './link.scss';
export interface CustomLinkAttrs {
    href: string;
    text: string;
}
declare const CustomLinkView: FC<NodeViewProps & {
    node: {
        nodeSize: number;
        attrs: CustomLinkAttrs;
    };
}>;
export default CustomLinkView;
//# sourceMappingURL=link.d.ts.map