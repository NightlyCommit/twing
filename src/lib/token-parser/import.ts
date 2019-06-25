import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeImport} from "../node/import";

export class TwingTokenParserImport extends TwingTokenParser {
    parse(token: TwingToken) {
        let macro = this.parser.parseExpression();

        this.parser.getStream().expect(TwingTokenType.NAME, 'as');

        // template alias
        let var_ = new TwingNodeExpressionAssignName(this.parser.getStream().expect(TwingTokenType.NAME).getContent(), token.getLine(), token.getColumn());

        this.parser.getStream().expect(TwingTokenType.BLOCK_END);
        this.parser.addImportedSymbol('template', var_.getAttribute('name'));

        return new TwingNodeImport(macro, var_, token.getLine(), token.getColumn(), this.getTag());
    }

    getTag() {
        return 'import';
    }
}
