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
import {TwingToken} from "../token";

import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeSet} from "../node/set";

export class TwingTokenParserSet extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let stream = this.parser.getStream();
        let names = this.parser.parseAssignmentExpression();

        let capture = false;
        let values;

        if (stream.nextIf(TwingToken.OPERATOR_TYPE, '=')) {
            values = this.parser.parseMultitargetExpression();

            stream.expect(TwingToken.BLOCK_END_TYPE);

            if (names.getNodes().size !== values.getNodes().size) {
                throw new TwingErrorSyntax('When using set, you must have the same number of variables and assignments.', stream.getCurrent().getLine(), stream.getSourceContext());
            }
        }
        else {
            capture = true;

            if (names.getNodes().size > 1) {
                throw new TwingErrorSyntax('When using set with a block, you cannot have a multi-target.', stream.getCurrent().getLine(), stream.getSourceContext());
            }

            stream.expect(TwingToken.BLOCK_END_TYPE);

            values = this.parser.subparse([this, this.decideBlockEnd], true);

            stream.expect(TwingToken.BLOCK_END_TYPE);
        }

        return new TwingNodeSet(capture, names, values, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endset');
    }

    getTag() {
        return 'set';
    }
}
