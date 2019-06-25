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
import {TwingToken, TwingTokenType} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeIf} from "../node/if";


export class TwingTokenParserIf extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let expr = this.parser.parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.BLOCK_END);

        let index = 0;
        let body = this.parser.subparse([this, this.decideIfFork]);
        let tests = new Map([
            [index++, expr],
            [index++, body]
        ]);

        let elseNode = null;

        let end = false;

        while (!end) {
            switch (stream.next().getContent()) {
                case 'else':
                    stream.expect(TwingTokenType.BLOCK_END);
                    elseNode = this.parser.subparse([this, this.decideIfEnd]);
                    break;

                case 'elseif':
                    expr = this.parser.parseExpression();
                    stream.expect(TwingTokenType.BLOCK_END);
                    body = this.parser.subparse([this, this.decideIfFork]);
                    tests.set(index++, expr);
                    tests.set(index++, body);
                    break;

                case 'endif':
                    end = true;
                    break;
            }
        }

        stream.expect(TwingTokenType.BLOCK_END);

        return new TwingNodeIf(new TwingNode(tests), elseNode, lineno, columnno, this.getTag());
    }

    decideIfFork(token: TwingToken) {
        return token.test(TwingTokenType.NAME, ['elseif', 'else', 'endif']);
    }

    decideIfEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endif');
    }

    getTag() {
        return 'if';
    }
}
