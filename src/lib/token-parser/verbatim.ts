import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingNodeVerbatim} from "../node/verbatim";

export class TwingTokenParserVerbatim extends TwingTokenParser {
    /**
     * @param {TwingToken} token
     *
     * @return TwingNodeVerbatim
     */
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        stream.expect(TwingToken.BLOCK_END_TYPE);

        /**
         * @type {TwingNodeText}
         */
        let text = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeVerbatim(text.getAttribute('data'), token.getLine(), token.getColumn(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endverbatim');
    }

    getTag() {
        return 'verbatim';
    }
}
