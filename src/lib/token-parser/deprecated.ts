import {TwingTokenParser} from "../token-parser";
import {TwingNodeDeprecated} from "../node/deprecated";
import {Token, TokenType} from "twig-lexer";

/**
 * Deprecates a section of a template.
 *
 * <pre>
 * {% deprecated 'The "base.twig" template is deprecated, use "layout.twig" instead.' %}
 *
 * {% extends 'layout.html.twig' %}
 * </pre>
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingTokenParserDeprecated extends TwingTokenParser {
    parse(token: Token) {
        let expr = this.parser.parseExpression();

        this.parser.getStream().expect(TokenType.TAG_END);

        return new TwingNodeDeprecated(expr, token.line, token.column, this.getTag());
    }

    getTag() {
        return 'deprecated';
    }
}
