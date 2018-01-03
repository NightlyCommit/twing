/**
 * Tests a condition.
 *
 * <pre>
 * {% if users %}
 *  <ul>
 *    {% for user in users %}
 *      <li>{{ user.username|e }}</li>
 *    {% endfor %}
 *  </ul>
 * {% endif %}
 * </pre>
 */
import TwingTokenParser from "../token-parser";
import TwingNode from "../node";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingErrorSyntax from "../error/syntax";
import TwingNodeIf = require("../node/if");
import TwingMap from "../map";

class TwingTokenParserIf extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let expr = this.parser.getExpressionParser().parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse(this.decideIfFork);
        let tests = new TwingMap();

        tests
            .push(expr)
            .push(body)
        ;

        let elseNode = null;

        let end = false;

        while (!end) {
            switch (stream.next().getValue()) {
                case 'else':
                    stream.expect(TwingTokenType.BLOCK_END_TYPE);
                    elseNode = this.parser.subparse(this.decideIfEnd);
                    break;

                case 'elseif':
                    expr = this.parser.getExpressionParser().parseExpression();
                    stream.expect(TwingTokenType.BLOCK_END_TYPE);
                    body = this.parser.subparse(this.decideIfFork);
                    tests.push(expr);
                    tests.push(body);
                    break;

                case 'endif':
                    end = true;
                    break;

                default:
                    throw new TwingErrorSyntax(`Unexpected end of template. Twig was looking for the following tags "else", "elseif", or "endif" to close the "if" block started at line ${lineno}).`, stream.getCurrent().getLine(), stream.getSourceContext());
            }
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeIf(new TwingNode(tests), elseNode, lineno, this.getTag());
    }

    decideIfFork(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, ['elseif', 'else', 'endif']);
    }

    decideIfEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endif');
    }

    getTag() {
        return 'if';
    }
}

export = TwingTokenParserIf;