import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNode, TwingNodeType} from "../node";


export class TwingTokenParserUse extends TwingTokenParser {
    parse(token: TwingToken) {
        let template = this.parser.getExpressionParser().parseExpression();
        let stream = this.parser.getStream();

        if (template.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
            throw new TwingErrorSyntax('The template references in a "use" statement must be a string.', stream.getCurrent().getLine(), stream.getSourceContext());
        }

        let targets = new Map();

        if (stream.nextIf(TwingToken.NAME_TYPE, 'with')) {
            do {
                let name = stream.expect(TwingToken.NAME_TYPE).getValue();
                let alias = name;

                if (stream.nextIf(TwingToken.NAME_TYPE, 'as')) {
                    alias = stream.expect(TwingToken.NAME_TYPE).getValue();
                }

                targets.set(name, new TwingNodeExpressionConstant(alias, token.getLine(), token.getColumn()));

                if (!stream.nextIf(TwingToken.PUNCTUATION_TYPE, ',')) {
                    break;
                }
            } while (true);
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        this.parser.addTrait(new TwingNode(new Map([['template', template], ['targets', new TwingNode(targets)]])));

        return new TwingNode();
    }

    getTag() {
        return 'use';
    }
}
