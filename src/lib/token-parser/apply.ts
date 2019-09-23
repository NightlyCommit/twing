import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingToken} from "../token";
import {TwingNodePrint} from "../node/print";
import {TwingNodeSet} from "../node/set";
import {TwingNodeExpressionTempName} from "../node/expression/temp-name";

/**
 * Applies filters on a section of a template.
 *
 *   {% apply upper %}
 *      This text becomes uppercase
 *   {% endapply %}
 */
export class TwingTokenParserApply extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let columno = token.getColumn();
        let name = this.parser.getVarName();

        let ref: TwingNodeExpressionTempName;

        ref = new TwingNodeExpressionTempName(name, false, lineno, columno);
        ref.setAttribute('always_defined', true);

        let filter = this.parser.parseFilterExpressionRaw(ref, this.getTag());

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        let nodes: Map<number, TwingNode> = new Map();

        ref = new TwingNodeExpressionTempName(name, true, lineno, columno);

        nodes.set(0, new TwingNodeSet(true, ref, body, lineno, columno, this.getTag()));
        nodes.set(1, new TwingNodePrint(filter, lineno, columno, this.getTag()));

        return new TwingNode(nodes);
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endapply');
    }

    getTag() {
        return 'apply';
    }
}
