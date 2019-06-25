import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";

import {TwingNodeImport} from "../node/import";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeExpression} from "../node/expression";

/**
 * Imports macros.
 *
 * <pre>
 *   {% from 'forms.html' import forms %}
 * </pre>
 */
export class TwingTokenParserFrom extends TwingTokenParser {
    parse(token: TwingToken) {
        let macro = this.parser.parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TwingTokenType.NAME, 'import');

        let targets = new Map();

        do {
            let name = stream.expect(TwingTokenType.NAME).getContent();
            let alias = name;

            if (stream.nextIf(TwingTokenType.NAME, 'as')) {
                alias = stream.expect(TwingTokenType.NAME).getContent();
            }

            targets.set(name, alias);

            if (!stream.nextIf(TwingTokenType.PUNCTUATION, ',')) {
                break;
            }
        } while (true);

        stream.expect(TwingTokenType.BLOCK_END);

        let node = new TwingNodeImport(macro, new TwingNodeExpressionAssignName(this.parser.getVarName(), token.getLine(), token.getColumn()), token.getLine(), token.getColumn(), this.getTag());

        for (let [name, alias] of targets) {
            this.parser.addImportedSymbol('function', alias, `macro_${name}`, node.getNode('var') as TwingNodeExpression);
        }

        return node;
    }

    getTag() {
        return 'from';
    }
}
