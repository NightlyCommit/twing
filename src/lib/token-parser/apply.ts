import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingNodePrint} from "../node/print";
import {TwingNodeSet} from "../node/set";
import {TwingNodeExpressionTempName} from "../node/expression/temp-name";
import {Token, TokenType} from "twig-lexer";

/**
 * Applies filters on a section of a template.
 *
 *   {% apply upper %}
 *      This text becomes uppercase
 *   {% endapply %}
 */
export class TwingTokenParserApply extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let lineno = token.line;
        let columno = token.column;
        let name = this.parser.getVarName();

        let ref: TwingNodeExpressionTempName;

        ref = new TwingNodeExpressionTempName(name, false, lineno, columno);
        ref.setAttribute('always_defined', true);

        let filter = this.parser.parseFilterExpressionRaw(ref, this.getTag());

        this.parser.getStream().expect(TokenType.TAG_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        this.parser.getStream().expect(TokenType.TAG_END);

        let nodes: Map<number, TwingNode> = new Map();

        ref = new TwingNodeExpressionTempName(name, true, lineno, columno);

        nodes.set(0, new TwingNodeSet(true, ref, body, lineno, columno, this.getTag()));
        nodes.set(1, new TwingNodePrint(filter, lineno, columno, this.getTag()));

        return new TwingNode(nodes);
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endapply');
    }

    getTag() {
        return 'apply';
    }
}
