import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingMap from "../map";
import TwingTokenType from "../token-type";
import TwingNodeImport from "../node/import";
import TwingNodeExpressionAssignName from "../node/expression/assign-name";
import TwingNodeExpression from "../node/expression";

/**
 * Imports macros.
 *
 * <pre>
 *   {% from 'forms.html' import forms %}
 * </pre>
 */
class TwingTokenParserFrom extends TwingTokenParser {
    parse(token: TwingToken) {
        let macro = this.parser.getExpressionParser().parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.NAME_TYPE, 'import');

        let targets = new TwingMap();

        do {
            let name = stream.expect(TwingTokenType.NAME_TYPE).getValue();
            let alias = name;

            if (stream.nextIf(TwingTokenType.NAME_TYPE,'as')) {
                alias = stream.expect(TwingTokenType.NAME_TYPE).getValue();
            }

            targets.set(name, alias);

            if (!stream.nextIf(TwingTokenType.PUNCTUATION_TYPE, ',')) {
                break;
            }
        } while (true);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let node = new TwingNodeImport(macro, new TwingNodeExpressionAssignName(this.parser.getVarName(), token.getLine()), token.getLine(), this.getTag());

        for (let [name, alias] of targets) {
            this.parser.addImportedSymbol('function', alias, `macro_${name}`, node.getNode('var') as TwingNodeExpression);
        }

        return node;
    }

    getTag() {
        return 'from';
    }
}

export default TwingTokenParserFrom;