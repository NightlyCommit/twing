import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingToken} from "../token";
import {TwingNodeExpressionBlockReference} from "../node/expression/block-reference";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNodeBlock} from "../node/block";
import {TwingNodePrint} from "../node/print";

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
    parse(token: TwingToken): TwingNode {
        console.error('The "filter" tag is deprecated since Twig 2.9, use the "apply" tag instead.');

        let name = this.parser.getVarName();
        let ref = new TwingNodeExpressionBlockReference(new TwingNodeExpressionConstant(name, token.getLine(), token.getColumn()), null, token.getLine(), token.getColumn(), this.getTag());
        let filter = this.parser.getExpressionParser().parseFilterExpressionRaw(ref, this.getTag());

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        let block = new TwingNodeBlock(name, body, token.getLine(), token.getColumn());

        this.parser.setBlock(name, block);

        return new TwingNodePrint(filter, token.getLine(), token.getColumn(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endfilter');
    }

    getTag() {
        return 'filter';
    }
}
