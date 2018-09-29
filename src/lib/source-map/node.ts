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
            let nodeCursor: Position = node.getCursor();

            nodeCursor.line = parentCursor.line;
            nodeCursor.column = parentCursor.column;

            let mappings: Array<Mapping> = [];
            let originalPosition: Position = node.getOriginalPosition();

            mappings.push({
                name: node.getName(),
                source: node.getSource(),
                original: {
                    line: originalPosition.line + 1,
                    column: originalPosition.column
                },
                generated: {
                    line: parentCursor.line + 1,
                    column: parentCursor.column
                }
            });

            for (let child of node.getChildren()) {
                let childMappings: Array<Mapping> = proceedNode(child, node.getCursor());

                for (let mapping of childMappings) {
                    mappings.push(mapping);
                }
            }

            let lines: Array<string> = node.getContent().split('\n');
            let lastLine: string = lines[lines.length - 1];

            if (lines.length > 1) {
                parentCursor.line += (lines.length - 1);
                parentCursor.column = 0;
            }

            parentCursor.column += lastLine.length;

            return mappings;
        };

        // send a virtual cursor since the parent is out of the scope
        // - i.e we are generating the mappings starting from this node
        return proceedNode(this, {
            line: 0,
            column: 0
        });
    }
}
