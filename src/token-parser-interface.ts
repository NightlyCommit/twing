import TwingParser from "./parser";
import {default as TwingToken} from "./token";
import TwingNode from "./node";

/**
 * Interface implemented by token parsers.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
interface TwingTokenParserInterface {
    /**
     * Sets the parser associated with this token parser.
     */
    setParser(parser: TwingParser): void;

    /**
     * Parses a token and returns a node.
     *
     * @return TwingNode A TwingNode instance
     *
     * @throws TwingErrorSyntax
     */
    parse(token: TwingToken): TwingNode;

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    getTag(): string;
}

export default TwingTokenParserInterface;