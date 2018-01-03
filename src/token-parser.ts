import TwingTokenParserInterface from "./token-parser-interface";
import TwingParser from "./parser";
import TwingToken from "./token";
import TwingNode from "./node";

/**
 * Base class for all token parsers.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
abstract class TwingTokenParser implements TwingTokenParserInterface {
    parse(token: TwingToken): TwingNode {
        throw new Error("Method not implemented.");
    }

    getTag(): string {
        throw new Error("Method not implemented.");
    }

    /**
     * @var TwingParser
     */
    protected parser: TwingParser;

    setParser(parser: TwingParser): void {
        this.parser = parser;
    }
}

export default TwingTokenParser;