/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingSource} from "../source";
import {TwingSourceMapNode} from "./node";
import {TwingNodeType} from "../node";

export class TwingSourceMapNodeFactory {
    private readonly _type: TwingNodeType;

    constructor(type: TwingNodeType) {
        this._type = type;
    }

    create(line: number, column: number, source: TwingSource): TwingSourceMapNode {
        return new TwingSourceMapNode(line, column, source, this.nodeType);
    }

    get nodeType(): TwingNodeType {
        return this._type;
    }
}
