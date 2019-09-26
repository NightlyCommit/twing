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
import {TwingNodeIf} from "../node/if";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserIf extends TwingTokenParser {
    parse(token: Token) {
        let lineno = token.line;
        let columnno = token.column;
        let expr = this.parser.parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TokenType.TAG_END);

        let index = 0;
        let body = this.parser.subparse([this, this.decideIfFork]);
        let tests = new Map([
            [index++, expr],
            [index++, body]
        ]);

        let elseNode = null;

        let end = false;

        while (!end) {
            switch (stream.next().value) {
                case 'else':
                    stream.expect(TokenType.TAG_END);
                    elseNode = this.parser.subparse([this, this.decideIfEnd]);
                    break;

                case 'elseif':
                    expr = this.parser.parseExpression();
                    stream.expect(TokenType.TAG_END);
                    body = this.parser.subparse([this, this.decideIfFork]);
                    tests.set(index++, expr);
                    tests.set(index++, body);
                    break;

                case 'endif':
                    end = true;
                    break;
            }
        }

        stream.expect(TokenType.TAG_END);

        return new TwingNodeIf(new TwingNode(tests), elseNode, lineno, columnno, this.getTag());
    }

    decideIfFork(token: Token) {
        return token.test(TokenType.NAME, ['elseif', 'else', 'endif']);
    }

    decideIfEnd(token: Token) {
        return token.test(TokenType.NAME, 'endif');
    }

    getTag() {
        return 'if';
    }
}
