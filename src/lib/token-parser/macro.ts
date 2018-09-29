/**
 * Defines a macro.
 *
 * <pre>
 * {% macro input(name, value, type, size) %}
 *    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
 * {% endmacro %}
 * </pre>
 */
import {TwingToken} from "../token";
import {TwingTokenParser} from "../token-parser";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeBody} from "../node/body";

import {TwingNodeMacro} from "../node/macro";
import {TwingNode} from "../node";

const varValidator = require('var-validator');

export class TwingTokenParserMacro extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let stream = this.parser.getStream();
        let name = stream.expect(TwingToken.NAME_TYPE).getValue();
        let safeName = name;

        if (!varValidator.isValid(name)) {
            safeName = Buffer.from(name).toString('hex');
        }

        let macroArguments = this.parser.getExpressionParser().parseArguments(true, true);

        stream.expect(TwingToken.BLOCK_END_TYPE);

        this.parser.pushLocalScope();

        let body = this.parser.subparse([this, this.decideBlockEnd], true);

        if (token = stream.nextIf(TwingToken.NAME_TYPE)) {
            let value = token.getValue();

            if (value != name) {
                throw new TwingErrorSyntax(`Expected endmacro for macro "${name}" (but "${value}" given).`, stream.getCurrent().getLine(), stream.getSourceContext());
            }
        }

        this.parser.popLocalScope();

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let nodes = new Map([
            [0, body]
        ]);

        this.parser.setMacro(name, new TwingNodeMacro(safeName, new TwingNodeBody(nodes), macroArguments, lineno, columnno, this.getTag()));

        return null;
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endmacro');
    }

    getTag() {
        return 'macro';
    }
}
