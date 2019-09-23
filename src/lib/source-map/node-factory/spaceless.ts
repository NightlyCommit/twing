import {TwingSourceMapNodeFactory} from "../node-factory";
import {TwingSource} from "../../source";
import {TwingSourceMapNodeSpaceless} from "../node/spaceless";
import {TwingNodeType} from "../../node";

export class TwingSourceMapNodeFactorySpaceless extends TwingSourceMapNodeFactory {
    constructor() {
        super(TwingNodeType.SPACELESS);
    }

    create(line: number, column: number, source: TwingSource): TwingSourceMapNodeSpaceless {
        return new TwingSourceMapNodeSpaceless(line, column, source);
    }
}
