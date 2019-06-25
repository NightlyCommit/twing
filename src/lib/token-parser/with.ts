import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeWith} from "../node/with";

export class TwingTokenParserWith extends TwingTokenParser {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        let variables = null;
        let only = false;

        if (!stream.test(TwingTokenType.BLOCK_END)) {
            variables = this.parser.parseExpression();

            only = stream.nextIf(TwingTokenType.NAME, 'only') !== null;
        }

        stream.expect(TwingTokenType.BLOCK_END);

        let body = this.parser.subparse([this, this.decideWithEnd], true);

        stream.expect(TwingTokenType.BLOCK_END);

        return new TwingNodeWith(body, variables, only, token.getLine(), token.getColumn(), this.getTag());
    }

    decideWithEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endwith');
    }

    getTag() {
        return 'with';
    }
}
