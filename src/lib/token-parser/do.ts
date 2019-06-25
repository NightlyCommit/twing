import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeDo} from "../node/do";

export class TwingTokenParserDo extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.parseExpression();

        this.parser.getStream().expect(TwingTokenType.BLOCK_END);

        return new TwingNodeDo(expr, token.getLine(), token.getColumn(), this.getTag());
    }

    getTag() {
        return 'do';
    }
}
