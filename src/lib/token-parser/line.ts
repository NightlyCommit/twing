import {TwingTokenParser} from "../token-parser";
import {Token, TokenType} from "twig-lexer";
import {TwingNodeLine} from "../node/line";

export class TwingTokenParserLine extends TwingTokenParser {
    parse(token: Token) {
        let numberToken = this.parser.getStream().expect(TokenType.NUMBER);

        this.parser.getStream().expect(TokenType.TAG_END);

        return new TwingNodeLine(Number(numberToken.value), token.line, token.column, this.getTag());
    }

    getTag() {
        return 'line';
    }
}
