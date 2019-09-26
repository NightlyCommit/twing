import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingNodeExpressionBlockReference} from "../node/expression/block-reference";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNodeBlock} from "../node/block";
import {TwingNodePrint} from "../node/print";
import {Token, TokenType} from "twig-lexer";

/**
 * Filters a section of a template by applying filters.
 *
 * <pre>
 * {% filter upper %}
 *  This text becomes uppercase
 * {% endfilter %}
 * </pre>
 */
export class TwingTokenParserFilter extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let stream = this.parser.getStream();
        let line = token.line;
        let column = token.column;

        console.warn(`The "filter" tag in "${stream.getSourceContext().getName()}" at line ${line} is deprecated since Twig 2.9, use the "apply" tag instead.`);

        let name = this.parser.getVarName();
        let ref = new TwingNodeExpressionBlockReference(new TwingNodeExpressionConstant(name, line, column), null, line, column, this.getTag());
        let filter = this.parser.parseFilterExpressionRaw(ref, this.getTag());

        stream.expect(TokenType.TAG_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TokenType.TAG_END);

        let block = new TwingNodeBlock(name, body, line, column);

        this.parser.setBlock(name, block);

        return new TwingNodePrint(filter, line, column, this.getTag());
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endfilter');
    }

    getTag() {
        return 'filter';
    }
}
