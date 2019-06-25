import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNode} from "../node";
import {TwingErrorSyntax} from "../error/syntax";

import {TwingNodeBlock} from "../node/block";
import {TwingNodePrint} from "../node/print";
import {TwingNodeBlockReference} from "../node/block-reference";

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

export class TwingTokenParserBlock extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let stream = this.parser.getStream();
        let name = stream.expect(TwingTokenType.NAME).getContent();

        let safeName = name;

        if (!varValidator.isValid(name)) {
            safeName = Buffer.from(name).toString('hex');
        }

        if (this.parser.hasBlock(name)) {
            throw new TwingErrorSyntax(`The block '${name}' has already been defined line ${this.parser.getBlock(name).getTemplateLine()}.`, stream.getCurrent().getLine(), stream.getSourceContext());
        }

        let block = new TwingNodeBlock(safeName, new TwingNode(new Map()), lineno, columnno);

        this.parser.setBlock(name, block);
        this.parser.pushLocalScope();
        this.parser.pushBlockStack(name);

        let body;

        if (stream.nextIf(TwingTokenType.BLOCK_END)) {
            body = this.parser.subparse([this, this.decideBlockEnd], true);

            let token = stream.nextIf(TwingTokenType.NAME);

            if (token) {
                let value = token.getContent();

                if (value != name) {
                    throw new TwingErrorSyntax(`Expected endblock for block "${name}" (but "${value}" given).`, stream.getCurrent().getLine(), stream.getSourceContext());
                }
            }
        }
        else {
            let nodes = new Map();

            nodes.set(0, new TwingNodePrint(this.parser.parseExpression(), lineno, columnno));

            body = new TwingNode(nodes);
        }

        stream.expect(TwingTokenType.BLOCK_END);

        block.setNode('body', body);

        this.parser.popBlockStack();
        this.parser.popLocalScope();

        return new TwingNodeBlockReference(name, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endblock');
    }

    getTag() {
        return 'block';
    }
}
