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
import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingToken} from "../token";
import {TwingErrorSyntax} from "../error/syntax";

export class TwingTokenParserExtends extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let stream = this.parser.getStream();

        if (!this.parser.isMainScope()) {
            throw new TwingErrorSyntax('Cannot extend from a block.', token.getLine(), stream.getSourceContext());
        }

        if (this.parser.getParent() !== null) {
            throw new TwingErrorSyntax('Multiple extends tags are forbidden.', token.getLine(), stream.getSourceContext());
        }

        this.parser.setParent(this.parser.getExpressionParser().parseExpression());

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return null;
    }

    getTag() {
        return 'extends';
    }
}
