import {TwingNodeType} from "../node";
import {Mapping} from "source-map";

export type Position = {
    line: number, // 0-based
    column: number // 0-based
}

export class TwingSourceMapNode {
    protected name: string;
    protected source: string;
    protected originalPosition: Position;
    protected parent: TwingSourceMapNode;
    protected children: TwingSourceMapNode[];
    protected content: string;
    protected cursor: Position;

    /**
     * TwingSourceMapTreeNode constructor
     *
     * @param {string} type
     * @param {string} source
     * @param {number} line 0-based
     * @param {number} column 0-based
     */
    constructor(name: string, source: string, line: number, column: number) {
        this.name = name;
        this.source = source;
        this.originalPosition = {
            line: line,
            column: column
        };
        this.content = null;
        this.parent = null;
        this.children = [];
        this.cursor = {
            line: 0,
            column: 0
        };
    }

    getName() {
        return this.name;
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

    getCursor() {
        return this.cursor;
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

    /**
     * Returns the mappings starting from this node.
     *
     * @returns {Array<Mapping>}
     */
    toMappings(): Array<Mapping> {
        let proceedNode = (node: TwingSourceMapNode, parentCursor: Position): Array<Mapping> => {
            let mappings: Array<Mapping> = [];

            let children = node.getChildren();
            let originalPosition = node.getOriginalPosition();

            let lines = node.getContent().split('\n');

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];

                mappings.push({
                    name: node.getName(),
                    source: node.getSource(),
                    original: {
                        line: originalPosition.line + 1, // 1-based,
                        column: originalPosition.column
                    },
                    generated: {
                        line: parentCursor.line + 1, // 1-based,
                        column: parentCursor.column
                    }
                });

                if (parentCursor) {
                    if (i > 0) {
                        parentCursor.line++;
                        parentCursor.column = 0;
                    }

                    parentCursor.column += line.length;
                }
            }

            mappings.push({
                name: node.getName(),
                source: node.getSource(),
                original: {
                    line: originalPosition.line + 1, // 1-based,
                    column: originalPosition.column
                },
                generated: {
                    line: parentCursor.line + 1, // 1-based,
                    column: parentCursor.column - 1
                }
            });

            for (let child of children) {
                let childMappings = proceedNode(child, node.getCursor());

                for (let mapping of childMappings) {
                    mappings.push(mapping);
                }
            }

            return mappings;
        };

        // send a virtual cursor since the parent is out of the scope
        // - i.e we are generating the mappings starting from this node
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

            attributes.push('name: "' + node.name + '"');
            attributes.push('source: "' + node.source + '"');
            attributes.push('cursor: "' + node.cursor.line + ',' + node.cursor.column + '"');

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
