import {SourceNode} from "source-map";
import {TwingSource} from "../source";

export class TwingSourceMapNode {
    protected _name: string;
    protected _source: TwingSource;
    protected _line: number;
    protected _column: number;
    protected _parent: TwingSourceMapNode;
    protected _children: TwingSourceMapNode[];
    protected _content: string;

    /**
     * TwingSourceMapNode constructor
     *
     * @param {number} line 0-based
     * @param {number} column 0-based
     * @param {TwingSource} source
     * @param {string} name
     */
    constructor(line: number, column: number, source: TwingSource, name: string) {
        this._name = name;
        this._source = source;
        this._line = line;
        this._column = column;
        this._content = null;
        this._parent = null;
        this._children = [];
    }

    get name() {
        return this._name;
    }

    get source() {
        return this._source;
    }

    get line() {
        return this._line
    }

    get column() {
        return this._column;
    }

    get content(): string {
        return this._content;
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }

    set content(content: string) {
        this._content = content;
    }

    addChild(child: TwingSourceMapNode) {
        child._parent = this;

        this._children.push(child);
    }

    toSourceNode(): SourceNode {
        let chunks: string | SourceNode | (string | SourceNode)[] = null;

        if (this._children.length === 0) {
            chunks = this._content;
        }

        // source-map@6 types are faulty, we have to force-type chunks as any
        let sourceNode = new SourceNode(this._line, this._column, this._source.getPath(), chunks as any, this._name);

        sourceNode.setSourceContent(this._source.getPath(), this._source.getCode());

        for (let child of this._children) {
            sourceNode.add(child.toSourceNode() as any);
        }

        return sourceNode;
    }
}
