import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeSandbox} from "../node/sandbox";
import {TwingNode, TwingNodeType} from "../node";
import {ctypeSpace} from "../helpers/ctype_space";

export class TwingTokenParserSandbox extends TwingTokenParser {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.BLOCK_END);

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        stream.expect(TwingTokenType.BLOCK_END);

        // in a sandbox tag, only include tags are allowed
        if (body.getType() !== TwingNodeType.INCLUDE) {
            body.getNodes().forEach(function (node: TwingNode) {
                if (!(node.getType() === TwingNodeType.TEXT && ctypeSpace(node.getAttribute('data')))) {
                    if (node.getType() !== TwingNodeType.INCLUDE) {
                        throw new TwingErrorSyntax('Only "include" tags are allowed within a "sandbox" section.', node.getTemplateLine(), stream.getSourceContext());
                    }
                }
            });
        }

        return new TwingNodeSandbox(body, token.getLine(), token.getColumn(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endsandbox');
    }

    getTag() {
        return 'sandbox';
    }
}
