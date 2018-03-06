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
import {TwingNode, TwingNodeType} from "../node";
import {TwingToken} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeAutoEscape} from "../node/auto-escape";

export class TwingTokenParserAutoEscape extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let value: string;

        if (stream.test(TwingToken.BLOCK_END_TYPE)) {
            value = 'html';
        }
        else {
            let expr = this.parser.getExpressionParser().parseExpression();

            if (expr.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
                throw new TwingErrorSyntax('An escaping strategy must be a string or false.', stream.getCurrent().getLine(), stream.getSourceContext());
            }

            value = expr.getAttribute('value');
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeAutoEscape(value, body, lineno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endautoescape');
    }

    getTag() {
        return 'autoescape';
    }
}
