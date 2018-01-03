/**
 * Defines a macro.
 *
 * <pre>
 * {% macro input(name, value, type, size) %}
 *    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
 * {% endmacro %}
 * </pre>
 */
import TwingToken from "../token";
import TwingTokenParser from "../token-parser";
import TwingTokenType from "../token-type";
import TwingErrorSyntax from "../error/syntax";
import TwingNodeBody from "../node/body";
import TwingMap from "../map";
import TwingNodeMacro from "../node/macro";
import TwingNode from "../node";

class TwingTokenParserMacro extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let name = stream.expect(TwingTokenType.NAME_TYPE).getValue();

        let macroArguments = this.parser.getExpressionParser().parseArguments(true, true);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        this.parser.pushLocalScope();

        let body = this.parser.subparse(this.decideBlockEnd, true);

        if (token = stream.nextIf(TwingTokenType.NAME_TYPE)) {
            let value = token.getValue();

            if (value != name) {
                throw new TwingErrorSyntax(`Expected endmacro for macro "${name}" (but "${value}" given).`, stream.getCurrent().getLine(), stream.getSourceContext());
            }
        }

        this.parser.popLocalScope();

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let nodes = new TwingMap();

        nodes.push(body);

        this.parser.setMacro(name, new TwingNodeMacro(name, new TwingNodeBody(nodes), macroArguments, lineno, this.getTag()));

        return null;
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endmacro');
    }

    getTag() {
        return 'macro';
    }
}

export default TwingTokenParserMacro;