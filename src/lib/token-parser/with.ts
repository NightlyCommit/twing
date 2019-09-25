import {TwingTokenParser} from "../token-parser";
import {TwingNodeWith} from "../node/with";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserWith extends TwingTokenParser {
    parse(token: Token) {
        let stream = this.parser.getStream();

        let variables = null;
        let only = false;

        if (!stream.test(TokenType.TAG_END)) {
            variables = this.parser.parseExpression();

            only = stream.nextIf(TokenType.NAME, 'only') !== null;
        }

        stream.expect(TokenType.TAG_END);

        let body = this.parser.subparse([this, this.decideWithEnd], true);

        stream.expect(TokenType.TAG_END);

        return new TwingNodeWith(body, variables, only, token.line, token.column, this.getTag());
    }

    decideWithEnd(token: Token) {
        return token.test(TokenType.NAME, 'endwith');
    }

    getTag() {
        return 'with';
    }
}
