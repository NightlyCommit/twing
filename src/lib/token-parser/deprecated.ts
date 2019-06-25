import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeDeprecated} from "../node/deprecated";

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
    parse(token: TwingToken) {
        let expr = this.parser.parseExpression();

        this.parser.getStream().expect(TwingTokenType.BLOCK_END);

        return new TwingNodeDeprecated(expr, token.getLine(), token.getColumn(), this.getTag());
    }

    getTag() {
        return 'deprecated';
    }
}
