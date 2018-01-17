import TwingTokenParser from "../token-parser";
import TwingTokenType from "../token-type";
import TwingToken from "../token";
import TwingNodeFlush from "../node/flush";

class TwingTokenParserFlush extends TwingTokenParser {
    parse(token: TwingToken) {
        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeFlush(token.getLine(), this.getTag());
    }

    getTag() {
        return 'flush';
    }
}

export default TwingTokenParserFlush;