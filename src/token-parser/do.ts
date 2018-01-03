import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeDo = require("../node/do");

class TwingTokenParserDo extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.getExpressionParser().parseExpression();

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeDo(expr, token.getLine(), this.getTag());
    }

    getTag() {
        return 'do';
    }
}

export = TwingTokenParserDo;