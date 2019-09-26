/**
 * Loops over each item of a sequence.
 *
 * <pre>
 * <ul>
 *  {% for user in users %}
 *    <li>{{ user.username|e }}</li>
 *  {% endfor %}
 * </ul>
 * </pre>
 */
import {TwingTokenParser} from "../token-parser";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeSet} from "../node/set";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserSet extends TwingTokenParser {
    parse(token: Token) {
        let lineno = token.line;
        let columnno = token.column;
        let stream = this.parser.getStream();
        let names = this.parser.parseAssignmentExpression();

        let capture = false;
        let values;

        if (stream.nextIf(TokenType.OPERATOR, '=')) {
            values = this.parser.parseMultitargetExpression();

            stream.expect(TokenType.TAG_END);

            if (names.getNodes().size !== values.getNodes().size) {
                throw new TwingErrorSyntax('When using set, you must have the same number of variables and assignments.', stream.getCurrent().line, stream.getSourceContext());
            }
        }
        else {
            capture = true;

            if (names.getNodes().size > 1) {
                throw new TwingErrorSyntax('When using set with a block, you cannot have a multi-target.', stream.getCurrent().line, stream.getSourceContext());
            }

            stream.expect(TokenType.TAG_END);

            values = this.parser.subparse([this, this.decideBlockEnd], true);

            stream.expect(TokenType.TAG_END);
        }

        return new TwingNodeSet(capture, names, values, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endset');
    }

    getTag() {
        return 'set';
    }
}
