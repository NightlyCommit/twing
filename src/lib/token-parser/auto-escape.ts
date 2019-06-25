/**
 * Marks a section of a template to be escaped or not.
 */
import {TwingTokenParser} from "../token-parser";
import {TwingNode, TwingNodeType} from "../node";
import {TwingToken, TwingTokenType} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeAutoEscape} from "../node/auto-escape";

export class TwingTokenParserAutoEscape extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let stream = this.parser.getStream();
        let value: string;

        if (stream.test(TwingTokenType.BLOCK_END)) {
            value = 'html';
        }
        else {
            let expr = this.parser.parseExpression();

            if (expr.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
                throw new TwingErrorSyntax('An escaping strategy must be a string or false.', stream.getCurrent().getLine(), stream.getSourceContext());
            }

            value = expr.getAttribute('value');
        }

        stream.expect(TwingTokenType.BLOCK_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingTokenType.BLOCK_END);

        return new TwingNodeAutoEscape(value, body, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endautoescape');
    }

    getTag() {
        return 'autoescape';
    }
}
