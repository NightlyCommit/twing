/**
 * Marks a section of a template to be escaped or not.
 */
import {TwingTokenParser} from "../token-parser";
import {TwingNode, TwingNodeType} from "../node";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeAutoEscape} from "../node/auto-escape";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserAutoEscape extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let lineno = token.line;
        let columnno = token.column;
        let stream = this.parser.getStream();
        let value: string;

        if (stream.test(TokenType.TAG_END)) {
            value = 'html';
        }
        else {
            let expr = this.parser.parseExpression();

            if (expr.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
                throw new TwingErrorSyntax('An escaping strategy must be a string or false.', stream.getCurrent().line, stream.getSourceContext());
            }

            value = expr.getAttribute('value');
        }

        stream.expect(TokenType.TAG_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TokenType.TAG_END);

        return new TwingNodeAutoEscape(value, body, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endautoescape');
    }

    getTag() {
        return 'autoescape';
    }
}
