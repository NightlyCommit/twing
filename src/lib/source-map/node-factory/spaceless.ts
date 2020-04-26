import {TwingSourceMapNodeFactory} from "../node-factory";
import {TwingSource} from "../../source";
import {TwingSourceMapNodeSpaceless} from "../node/spaceless";
import {type as spacelessType} from "../../node/spaceless";

export class TwingSourceMapNodeFactorySpaceless extends TwingSourceMapNodeFactory {
    constructor() {
        super(spacelessType.toString());
    }

    create(line: number, column: number, source: TwingSource): TwingSourceMapNodeSpaceless {
        return new TwingSourceMapNodeSpaceless(line, column, source);
    }
}
