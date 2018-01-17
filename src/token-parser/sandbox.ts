import TwingTokenParser from "../token-parser";
import TwingTokenType from "../token-type";
import TwingToken from "../token";
import TwingNodeText from "../node/text";
import TwingNodeInclude from "../node/include";
import TwingErrorSyntax from "../error/syntax";
import TwingNodeSandbox from "../node/sandbox";

const ctype_space = require('locutus/php/ctype/ctype_space');

class TwingTokenParserSandbox extends TwingTokenParser {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        // in a sandbox tag, only include tags are allowed
        if (!(body instanceof TwingNodeInclude)) {
            body.getNodes().forEach(function (node) {
                if (!(node instanceof TwingNodeText && ctype_space(node.getAttribute('data')))) {
                    if (!(node instanceof TwingNodeInclude)) {
                        throw new TwingErrorSyntax('Only "include" tags are allowed within a "sandbox" section.', node.getTemplateLine(), stream.getSourceContext());
                    }
                }
            });
        }

        return new TwingNodeSandbox(body, token.getLine(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endsandbox');
    }

    getTag() {
        return 'sandbox';
    }
}

export default TwingTokenParserSandbox;