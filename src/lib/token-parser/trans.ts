import {TwingTokenParser} from "../token-parser";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserTrans extends TwingTokenParser {
    parse(token: Token) {
        let stream = this.parser.getStream();

        stream.expect(TokenType.TAG_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TokenType.TAG_END);

        return body;
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endtrans');
    }

    getTag() {
        return 'trans';
    }
}
