import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingParser} from "./parser";
import {TwingNode} from "./node";
import {Token} from "twig-lexer";

/**
 * Base class for all token parsers.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingTokenParser implements TwingTokenParserInterface {
    TwingTokenParserInterfaceImpl: TwingTokenParserInterface;

    constructor() {
        this.TwingTokenParserInterfaceImpl = this;
    }

    /**
     * @var TwingParser
     */
    protected parser: TwingParser;

    abstract parse(token: Token): TwingNode;

    abstract getTag(): string;

    setParser(parser: TwingParser): void {
        this.parser = parser;
    }
}
