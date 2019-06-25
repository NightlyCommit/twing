import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeFlush} from "../node/flush";

export class TwingTokenParserFlush extends TwingTokenParser {
    parse(token: TwingToken) {
        this.parser.getStream().expect(TwingTokenType.BLOCK_END);

        return new TwingNodeFlush(token.getLine(), token.getColumn(), this.getTag());
    }

    getTag() {
        return 'flush';
    }
}
