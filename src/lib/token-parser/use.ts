import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNode, TwingNodeType} from "../node";


export class TwingTokenParserUse extends TwingTokenParser {
    parse(token: TwingToken) {
        let template = this.parser.parseExpression();
        let stream = this.parser.getStream();

        if (template.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
            throw new TwingErrorSyntax('The template references in a "use" statement must be a string.', stream.getCurrent().getLine(), stream.getSourceContext());
        }

        let targets = new Map();

        if (stream.nextIf(TwingTokenType.NAME, 'with')) {
            do {
                let name = stream.expect(TwingTokenType.NAME).getContent();
                let alias = name;

                if (stream.nextIf(TwingTokenType.NAME, 'as')) {
                    alias = stream.expect(TwingTokenType.NAME).getContent();
                }

                targets.set(name, new TwingNodeExpressionConstant(alias, token.getLine(), token.getColumn()));

                if (!stream.nextIf(TwingTokenType.PUNCTUATION, ',')) {
                    break;
                }
            } while (true);
        }

        stream.expect(TwingTokenType.BLOCK_END);

        this.parser.addTrait(new TwingNode(new Map([['template', template], ['targets', new TwingNode(targets)]])));

        return new TwingNode();
    }

    getTag() {
        return 'use';
    }
}
