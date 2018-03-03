import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingToken} from "../token";
import {TwingTokenType} from "../token-type";
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
        let name = this.parser.getVarName();
        let ref = new TwingNodeExpressionBlockReference(new TwingNodeExpressionConstant(name, token.getLine()), null, token.getLine(), this.getTag());
        let filter = this.parser.getExpressionParser().parseFilterExpressionRaw(ref, this.getTag());

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        let block = new TwingNodeBlock(name, body, token.getLine());

        this.parser.setBlock(name, block);

        return new TwingNodePrint(filter, token.getLine(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endfilter');
    }

    getTag() {
        return 'filter';
    }
}
