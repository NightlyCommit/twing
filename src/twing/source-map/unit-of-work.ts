import {TwingNodeType} from "../node";
import {Mapping} from "source-map";

export type Position = {
    line: number, // 0-based
    column: number // 0-based
}

export class TwingSourceMapUnitOfWork {
    private type: TwingNodeType;
    private source: string;
    private cursor: Position;
    private originalPosition: Position;
    private generatedPosition: Position;
    private level: number;
    private parent: TwingSourceMapUnitOfWork;
    private children: TwingSourceMapUnitOfWork[];
    private content: string;

    /**
     * TwingSourceMapUnitOfWork constructor
     *
     * @param {TwingNodeType} type
     * @param {string} source
     * @param {number} line 0-based
     * @param {number} column 0-based
     */
    constructor(type: TwingNodeType = null, source: string = null, line: number = 0, column: number = 0) {
        this.type = type;
        this.source = source;
        this.originalPosition = {
            line: line,
            column: column
        };
        this.generatedPosition = {
            line: 0,
            column: 0
        };
        this.content = '';
        this.parent = null;
        this.children = [];
        this.cursor = {
            line: 0,
            column: 0
        };
        this.level = 0;
    }

    getType(): TwingNodeType {
        return this.type;
    }

    getSource(): string {
        return this.source;
    }

    setLevel(level: number) {
        this.level = level;
    }

    getLevel(): number {
        return this.level;
    }

    addChild(child: TwingSourceMapUnitOfWork) {
        child.setParent(this);
        child.setLevel(this.getLevel() + 1);

        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

    setContent(content: string | false) {
        if (content !== false) {
            this.content = content;

            if (this.parent) {
                this.generatedPosition = {
                    line: this.parent.getCursor().line,
                    column: this.parent.getCursor().column
                };

                console.warn('ADVANCE PARENT CURSOR "' + content + '"');

                this.parent.advanceCursor(content);

                console.warn('ADVANCED PARENT CURSOR', this.parent.getCursor());

            }
        }
    }

    getCursor(): Position {
        return this.cursor;
    }

    advanceCursor(content: String) {
        let lines = content.split('\n');
        let linesCount = lines.length - 1;

        console.warn('advanceCursor', lines);

        if (linesCount > 0) {
            this.cursor.line += linesCount;
            this.cursor.column = 0;
        }

        let lastLine = lines.pop();

        this.cursor.column += lastLine.length;
    }

    setParent(parent: TwingSourceMapUnitOfWork) {
        this.parent = parent;
    }

    hasParent() {
        return this.parent !== null;
    }

    getParent() {
        return this.parent;
    }

    toMappings(): Array<Mapping> {
        let mappings = [];
        let lines = this.content.split('\n');

        let lineno: number = this.generatedPosition.line;
        let columnno: number = this.generatedPosition.column;
        let parentCursor: Position;

        if (this.parent) {
            parentCursor = this.parent.getCursor();
        }
        else {
            parentCursor = {
                line: 0,
                column: 0
            };
        }

        console.warn('toMappings', this.type, lineno, parentCursor);


        let l = parentCursor.line;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (i > 0) {
                lineno++;
                columnno = 0;
            }

            // skip empty last line
            // if ((i < (lines.length - 1)) || (line.length > 0)) {
                mappings.push({
                    name: this.type,
                    source: this.source,
                    original: {
                        line: this.originalPosition.line + 1, // 1-based,
                        column: this.originalPosition.column
                    },
                    generated: {
                        line: lineno + 1, // 1-based,
                        column: columnno
                    }
                });
            // }
        }

        return mappings;
    }

    toString(): string {
        let parts = [];
        let repr = [];

        repr.push(' '.repeat(this.getLevel() * 4) + this.constructor.name + '(');
        repr.push(' '.repeat((this.getLevel() + 1) * 4) + 'name: "' + this.type + '"');
        repr.push(' '.repeat((this.getLevel() + 1) * 4) + 'cursor: ' + this.cursor.line + '/' + this.cursor.column);
        repr.push(' '.repeat((this.getLevel() + 1) * 4) + 'generated position: ' + this.generatedPosition.line + '/' + this.generatedPosition.column);
        repr.push(' '.repeat((this.getLevel() + 1) * 4) + 'content: "' + this.content + '"');

        parts.push(repr.join('\n'));

        for (let child of this.getChildren()) {
            parts.push(child.toString());
        }

        parts.push(' '.repeat(this.getLevel() * 4) + ')');

        return parts.join('\n');
    }
}
