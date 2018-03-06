import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingNodeDo} from "../node/do";

export class TwingTokenParserDo extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.getExpressionParser().parseExpression();

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeDo(expr, token.getLine(), this.getTag());
    }

    getTag() {
        return 'do';
    }
}
