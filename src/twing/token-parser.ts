import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingParser} from "./parser";
import {TwingToken} from "./token";
import {TwingNode} from "./node";

/**
 * Base class for all token parsers.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingTokenParser implements TwingTokenParserInterface {
    /**
     * @var TwingParser
     */
    protected parser: TwingParser;

    abstract parse(token: TwingToken): TwingNode;

    abstract getTag(): string;

    setParser(parser: TwingParser): void {
        this.parser = parser;
    }
}
