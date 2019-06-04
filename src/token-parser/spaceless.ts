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
import {TwingNode} from "../node";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeSpaceless} from "../node/spaceless";

export class TwingTokenParserSpaceless extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let columnno = token.getColumn();

        this.parser.getStream().expect(TwingTokenType.BLOCK_END);
        let body = this.parser.subparse([this, this.decideSpacelessEnd], true);
        this.parser.getStream().expect(TwingTokenType.BLOCK_END);

        return new TwingNodeSpaceless(body, lineno, columnno, this.getTag());
    }

    decideSpacelessEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endspaceless');
    }

    getTag() {
        return 'spaceless';
    }
}
