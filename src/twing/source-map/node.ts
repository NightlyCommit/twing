import {TwingNodeType} from "../node";
import {Mapping} from "source-map";

export type Position = {
    line: number, // 0-based
    column: number // 0-based
}

export class TwingSourceMapNode {
    protected type: TwingNodeType;
    protected source: string;
    protected originalPosition: Position;
    protected parent: TwingSourceMapNode;
    protected children: TwingSourceMapNode[];
    protected content: string;

    /**
     * TwingSourceMapTreeNode constructor
     *
     * @param {TwingNodeType} type
     * @param {string} source
     * @param {number} line 0-based
     * @param {number} column 0-based
     */
    constructor(type: TwingNodeType, source: string, line: number, column: number) {
        this.type = type;
        this.source = source;
        this.originalPosition = {
            line: line,
            column: column
        };
        this.content = null;
        this.parent = null;
        this.children = [];
    }

    getType() {
        return this.type;
    }

    getSource() {
        return this.source;
    }

    getOriginalPosition(): Position {
        return this.originalPosition;
    }

    getContent(): string {
        return this.content;
    }

    getParent() {
        return this.parent;
    }

    getChildren() {
        return this.children;
    }

    addChild(child: TwingSourceMapNode) {
        child.parent = this;

        this.children.push(child);
    }

    setContent(content: string | false) {
        if (content !== false) {
            this.content = content;
        }
        else {
            this.content = null;
        }
    }

    toMappings(): Array<Mapping> {
        let proceedNode = (node: TwingSourceMapNode, cursor: Position): Array<Mapping> => {
            let mappings: Array<Mapping> = [];

            let children = node.getChildren();
            let originalPosition = node.getOriginalPosition();

            let lines = node.getContent().split('\n');

            let lineno: number = cursor.line;
            let columnno: number = cursor.column;

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];

                if (i > 0) {
                    lineno++;
                    columnno = 0;
                }

                let mapping = {
                    name: node.getType(),
                    source: node.getSource(),
                    original: {
                        line: originalPosition.line + 1, // 1-based,
                        column: originalPosition.column
                    },
                    generated: {
                        line: lineno + 1, // 1-based,
                        column: columnno
                    }
                };

                columnno += line.length;

                if (children.length < 1) {
                    cursor.line = lineno;
                    cursor.column = columnno;
                }

                mappings.push(mapping);
            }

            for (let child of children) {
                let childMappings = proceedNode(child, cursor);

                for (let mapping of childMappings) {
                    mappings.push(mapping);
                }
            }

            return mappings;
        };

        console.warn(this.toString());

        return proceedNode(this, {
            line: 0,
            column: 0
        });
    }

    toString(): string {
        let _toString = (node: TwingSourceMapNode, indentLevel: number = 0): string => {
            let repr = [];

            let indent = (count: number = 0) => {
                return ' '.repeat((indentLevel + count) * 4);
            };

            repr.push(indent() + node.constructor.name + '(');

            let attributes = [];

            attributes.push('name: "' + node.type + '"');
            attributes.push('source: "' + node.source + '"');

            repr.push(indent(1) + attributes.join(', '));
            repr.push(indent(1) + 'content: "' + node.content + '" (' + node.content.length + ')');

            if (node.getChildren().length) {
                repr.push(indent(1) + 'children: ');

                for (let child of node.getChildren()) {
                    repr.push(_toString(child, indentLevel + 2));
                }
            }

            repr.push(indent() + ')');

            return repr.join('\n');
        };

        return _toString(this);
    }
}
