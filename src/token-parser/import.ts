import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeExpressionAssignName from "../node/expression/assign-name";
import TwingNodeImport from "../node/import";

class TwingTokenParserImport extends TwingTokenParser {
    parse(token: TwingToken) {
        let macro = this.parser.getExpressionParser().parseExpression();

        this.parser.getStream().expect(TwingTokenType.NAME_TYPE, 'as');

        // template alias
        let var_ = new TwingNodeExpressionAssignName(this.parser.getStream().expect(TwingTokenType.NAME_TYPE).getValue(), token.getLine());

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);
        this.parser.addImportedSymbol('template', var_.getAttribute('name'));

        return new TwingNodeImport(macro, var_, token.getLine(), this.getTag());
    }

    getTag() {
        return 'import';
    }
}

export = TwingTokenParserImport;