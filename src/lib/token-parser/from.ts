import {TwingTokenParser} from "../token-parser";
import {TwingNodeImport} from "../node/import";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeExpression} from "../node/expression";
import {Token, TokenType} from "twig-lexer";

/**
 * Imports macros.
 *
 * <pre>
 *   {% from 'forms.html' import forms %}
 * </pre>
 */
export class TwingTokenParserFrom extends TwingTokenParser {
    parse(token: Token) {
        let macro = this.parser.parseExpression();
        let stream = this.parser.getStream();

        stream.expect(TokenType.NAME, 'import');

        let targets = new Map();

        do {
            let name = stream.expect(TokenType.NAME).value;
            let alias = name;

            if (stream.nextIf(TokenType.NAME, 'as')) {
                alias = stream.expect(TokenType.NAME).value;
            }

            targets.set(name, alias);

            if (!stream.nextIf(TokenType.PUNCTUATION, ',')) {
                break;
            }
        } while (true);

        stream.expect(TokenType.TAG_END);

        let node = new TwingNodeImport(macro, new TwingNodeExpressionAssignName(this.parser.getVarName(), token.line, token.column), token.line, token.column, this.getTag());

        for (let [name, alias] of targets) {
            this.parser.addImportedSymbol('function', alias, `macro_${name}`, node.getNode('var') as TwingNodeExpression);
        }

        return node;
    }

    getTag() {
        return 'from';
    }
}
