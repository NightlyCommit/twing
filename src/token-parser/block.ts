import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNode from "../node";
import TwingErrorSyntax from "../error/syntax";
import TwingMap from "../map";
import TwingNodeBlock from "../node/block";
import TwingNodePrint from "../node/print";
import TwingNodeBlockReference from "../node/block-reference";

/**
 * Marks a section of a template as being reusable.
 *
 * <pre>
 *  {% block head %}
 *    <link rel="stylesheet" href="style.css" />
 *    <title>{% block title %}{% endblock %} - My Webpage</title>
 *  {% endblock %}
 * </pre>
 */
const varValidator = require('var-validator');

class TwingTokenParserBlock extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let name = stream.expect(TwingTokenType.NAME_TYPE).getValue();

        let safeName = name;

        if (!varValidator.isValid(name)) {
            safeName = Buffer.from(name).toString('hex');
        }

        if (this.parser.hasBlock(name)) {
            throw new TwingErrorSyntax(`The block '${name}' has already been defined line ${this.parser.getBlock(name).getTemplateLine()}.`, stream.getCurrent().getLine(), stream.getSourceContext());
        }

        let block = new TwingNodeBlock(safeName, new TwingNode(new TwingMap()), lineno);

        this.parser.setBlock(name, block);
        this.parser.pushLocalScope();
        this.parser.pushBlockStack(name);

        let body;

        if (stream.nextIf(TwingTokenType.BLOCK_END_TYPE)) {
            body = this.parser.subparse([this, this.decideBlockEnd], true);

            let token = stream.nextIf(TwingTokenType.NAME_TYPE);

            if (token) {
                let value = token.getValue();

                if (value != name) {
                    throw new TwingErrorSyntax(`Expected endblock for block "${name}" (but "${value}" given).`, stream.getCurrent().getLine(), stream.getSourceContext());
                }
            }
        }
        else {
            let nodes = new TwingMap();

            nodes.push(new TwingNodePrint(this.parser.getExpressionParser().parseExpression(), lineno));

            body = new TwingNode(nodes);
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        block.setNode('body', body);

        this.parser.popBlockStack();
        this.parser.popLocalScope();

        return new TwingNodeBlockReference(name, lineno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE,'endblock');
    }

    getTag() {
        return 'block';
    }
}

export default TwingTokenParserBlock;