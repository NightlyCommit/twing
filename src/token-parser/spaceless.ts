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
import TwingTokenParser from "../token-parser";
import TwingNode from "../node";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeSpaceless from "../node/spaceless";

class TwingTokenParserSpaceless extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);
        let body = this.parser.subparse([this, this.decideSpacelessEnd], true);
        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeSpaceless(body, lineno, this.getTag());
    }

    decideSpacelessEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endspaceless');
    }

    getTag() {
        return 'spaceless';
    }
}

export default TwingTokenParserSpaceless;