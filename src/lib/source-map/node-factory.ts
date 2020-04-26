/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingSource} from "../source";
import {TwingSourceMapNode} from "./node";

export class TwingSourceMapNodeFactory {
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }

    create(line: number, column: number, source: TwingSource): TwingSourceMapNode {
        return new TwingSourceMapNode(line, column, source, this.nodeName);
    }

    get nodeName(): string {
        return this._name;
    }
}
