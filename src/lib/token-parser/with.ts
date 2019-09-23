import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingNodeWith} from "../node/with";

export class TwingTokenParserWith extends TwingTokenParser {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        let variables = null;
        let only = false;

        if (!stream.test(TwingToken.BLOCK_END_TYPE)) {
            variables = this.parser.parseExpression();

            only = stream.nextIf(TwingToken.NAME_TYPE, 'only') !== null;
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideWithEnd], true);

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodeWith(body, variables, only, token.getLine(), token.getColumn(), this.getTag());
    }

    decideWithEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endwith');
    }

    getTag() {
        return 'with';
    }
}
