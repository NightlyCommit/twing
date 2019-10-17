/**
 * Defines a macro.
 *
 * <pre>
 * {% macro input(name, value, type, size) %}
 *    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
 * {% endmacro %}
 * </pre>
 */
import {TwingTokenParser} from "../token-parser";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeBody} from "../node/body";

import {TwingNodeMacro} from "../node/macro";
import {TwingNode} from "../node";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserMacro extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let lineno = token.line;
        let columnno = token.column;
        let stream = this.parser.getStream();
        let name = stream.expect(TokenType.NAME).value;
        let macroArguments = this.parser.parseArguments(true, true);

        stream.expect(TokenType.TAG_END);

        this.parser.pushLocalScope();

        let body = this.parser.subparse([this, this.decideBlockEnd], true);
        let nextToken = stream.nextIf(TokenType.NAME);

        if (nextToken) {
            let value = nextToken.value;

            if (value != name) {
                throw new TwingErrorSyntax(`Expected endmacro for macro "${name}" (but "${value}" given).`, stream.getCurrent().line, stream.getSourceContext());
            }
        }

        this.parser.popLocalScope();

        stream.expect(TokenType.TAG_END);

        let nodes = new Map([
            [0, body]
        ]);

        this.parser.setMacro(name, new TwingNodeMacro(name, new TwingNodeBody(nodes), macroArguments, lineno, columnno, this.getTag()));

        return null;
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endmacro');
    }

    getTag() {
        return 'macro';
    }
}
