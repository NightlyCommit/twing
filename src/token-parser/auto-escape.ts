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
import TwingSyntaxError, {default as TwingErrorSyntax} from "../error/syntax";
import TwingTokenType from "../token-type";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeAutoEscape from "../node/auto-escape";

class TwingTokenParserAutoEscape extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let value: string;

        if (stream.test(TwingTokenType.BLOCK_END_TYPE)) {
            value = 'html';
        }
        else {
            let expr = this.parser.getExpressionParser().parseExpression();

            if (!(expr instanceof TwingNodeExpressionConstant)) {
                throw new TwingErrorSyntax('An escaping strategy must be a string or false.', stream.getCurrent().getLine(), stream.getSourceContext());
            }

            value = expr.getAttribute('value');
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse(this.decideBlockEnd, true);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeAutoEscape(value, body, lineno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endautoescape');
    }

    getTag() {
        return 'autoescape';
    }
}

export default TwingTokenParserAutoEscape;