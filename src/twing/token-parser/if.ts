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
import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingToken} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeIf} from "../node/if";


export class TwingTokenParserIf extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let expr = this.parser.getExpressionParser().parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let index = 0;
        let body = this.parser.subparse([this, this.decideIfFork]);
        let tests = new Map([
            [index++, expr],
            [index++, body]
        ]);

        let elseNode = null;

        let end = false;

        while (!end) {
            switch (stream.next().getValue()) {
                case 'else':
                    stream.expect(TwingToken.BLOCK_END_TYPE);
                    elseNode = this.parser.subparse([this, this.decideIfEnd]);
                    break;

                case 'elseif':
                    expr = this.parser.getExpressionParser().parseExpression();
                    stream.expect(TwingToken.BLOCK_END_TYPE);
                    body = this.parser.subparse([this, this.decideIfFork]);
                    tests.set(index++, expr);
                    tests.set(index++, body);
                    break;

                case 'endif':
                    end = true;
                    break;
            }
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeIf(new TwingNode(tests), elseNode, lineno, this.getTag());
    }

    decideIfFork(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, ['elseif', 'else', 'endif']);
    }

    decideIfEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endif');
    }

    getTag() {
        return 'if';
    }
}
