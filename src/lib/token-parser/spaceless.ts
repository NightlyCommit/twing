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
import {TwingNodeSpaceless} from "../node/spaceless";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserSpaceless extends TwingTokenParser {
    parse(token: Token): TwingNode {
        console.warn('The "spaceless" tag is deprecated since Twig 2.7, use the "spaceless" filter instead.');

        let lineno = token.line;
        let columnno = token.column;

        this.parser.getStream().expect(TokenType.TAG_END);
        let body = this.parser.subparse([this, this.decideSpacelessEnd], true);
        this.parser.getStream().expect(TokenType.TAG_END);

        return new TwingNodeSpaceless(body, lineno, columnno, this.getTag());
    }

    decideSpacelessEnd(token: Token) {
        return token.test(TokenType.NAME, 'endspaceless');
    }

    getTag() {
        return 'spaceless';
    }
}
