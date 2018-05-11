/**
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingSourceMapGeneratorInterface} from "../generator-interface";

export class TwingSourceMapGeneratorSpaceless implements TwingSourceMapGeneratorInterface {
    TwingSourceMapGeneratorInterfaceImpl: TwingSourceMapGeneratorInterface;

    constructor() {
        this.TwingSourceMapGeneratorInterfaceImpl = this;
    }
}
