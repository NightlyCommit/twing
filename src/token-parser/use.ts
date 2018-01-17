import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingErrorSyntax from "../error/syntax";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNode from "../node";
import TwingMap from "../map";

class TwingTokenParserUse extends TwingTokenParser {
    parse(token: TwingToken) {
        let template = this.parser.getExpressionParser().parseExpression();
        let stream = this.parser.getStream();

        if (!(template instanceof TwingNodeExpressionConstant)) {
            throw new TwingErrorSyntax('The template references in a "use" statement must be a string.', stream.getCurrent().getLine(), stream.getSourceContext());
        }

        let targets = new TwingMap();

        if (stream.nextIf(TwingTokenType.NAME_TYPE,'with')) {
            do {
                let name = stream.expect(TwingTokenType.NAME_TYPE).getValue();
                let alias = name;

                if (stream.nextIf(TwingTokenType.NAME_TYPE,'as')) {
                    alias = stream.expect(TwingTokenType.NAME_TYPE).getValue();
                }

                targets.set(name, new TwingNodeExpressionConstant(alias, token.getLine()));

                if (!stream.nextIf(TwingTokenType.PUNCTUATION_TYPE, ',')) {
                    break;
                }
            } while (true);
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        this.parser.addTrait(new TwingNode(new TwingMap([['template', template], ['targets', new TwingNode(targets)]])));

        return new TwingNode();
    }

    getTag() {
        return 'use';
    }
}

export default TwingTokenParserUse;