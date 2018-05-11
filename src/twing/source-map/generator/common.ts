/**
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingSourceMapGeneratorInterface} from "../generator-interface";

export class TwingSourceMapGeneratorCommon implements TwingSourceMapGeneratorInterface {
    TwingSourceMapGeneratorInterfaceImpl: TwingSourceMapGeneratorInterface;

    constructor() {
        this.TwingSourceMapGeneratorInterfaceImpl = this;
    }
}
