import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingNodeFlush} from "../node/flush";

export class TwingTokenParserFlush extends TwingTokenParser {
    parse(token: TwingToken) {
        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeFlush(token.getLine(), token.getColumn(), this.getTag());
    }

    getTag() {
        return 'flush';
    }
}
