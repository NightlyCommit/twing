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
import {TwingErrorSyntax} from "../error/syntax";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserExtends extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let stream = this.parser.getStream();

        if (this.parser.peekBlockStack()) {
            throw new TwingErrorSyntax('Cannot use "extend" in a block.', token.line, stream.getSourceContext());
        } else if (!this.parser.isMainScope()) {
            throw new TwingErrorSyntax('Cannot use "extend" in a macro.', token.line, stream.getSourceContext());
        }

        if (this.parser.getParent() !== null) {
            throw new TwingErrorSyntax('Multiple extends tags are forbidden.', token.line, stream.getSourceContext());
        }

        this.parser.setParent(this.parser.parseExpression());

        stream.expect(TokenType.TAG_END);

        return null;
    }

    getTag() {
        return 'extends';
    }
}
