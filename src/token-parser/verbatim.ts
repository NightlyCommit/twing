import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeVerbatim} from "../node/verbatim";

export class TwingTokenParserVerbatim extends TwingTokenParser {
    /**
     * @param {TwingToken} token
     *
     * @return TwingNodeVerbatim
     */
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.BLOCK_END);

        /**
         * @type {TwingNodeText}
         */
        let text = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingTokenType.BLOCK_END);

        return new TwingNodeVerbatim(text.getAttribute('data'), token.getLine(), token.getColumn(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endverbatim');
    }

    getTag() {
        return 'verbatim';
    }
}
