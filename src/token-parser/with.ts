import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeWith from "../node/with";

class TwingTokenParserWith extends TwingTokenParser {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        let variables = null;
        let only = false;

        if (!stream.test(TwingTokenType.BLOCK_END_TYPE)) {
            variables = this.parser.getExpressionParser().parseExpression();

            only = stream.nextIf(TwingTokenType.NAME_TYPE, 'only') !== null;
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse(this.decideWithEnd, true);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeWith(body, variables, only, token.getLine(), this.getTag());
    }

    decideWithEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE,'endwith');
    }

    getTag() {
        return 'with';
    }
}

export = TwingTokenParserWith;