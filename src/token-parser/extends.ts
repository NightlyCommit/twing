/**
 * Loops over each item of a sequence.
 *
 * <pre>
 * <ul>
 *  {% for user in users %}
 *    <li>{{ user.username|e }}</li>
 *  {% endfor %}
 * </ul>
 * </pre>
 */
import TwingTokenParser from "../token-parser";
import TwingNode from "../node";
import TwingToken from "../token";
import TwingSyntaxError from "../error/syntax";
import TwingTokenType from "../token-type";

class TwingTokenParserExtends extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let stream = this.parser.getStream();

        if (!this.parser.isMainScope()) {
            throw new TwingSyntaxError('Cannot extend from a block.', token.getLine(), stream.getSourceContext());
        }

        if (this.parser.getParent() !== null) {
            throw new TwingSyntaxError('Multiple extends tags are forbidden.', token.getLine(), stream.getSourceContext());
        }

        this.parser.setParent(this.parser.getExpressionParser().parseExpression());

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return null;
    }

    getTag() {
        return 'extends';
    }
}

export default TwingTokenParserExtends;