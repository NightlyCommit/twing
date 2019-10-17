import {TwingTokenParser} from "../token-parser";
import {TwingNode} from "../node";
import {TwingErrorSyntax} from "../error/syntax";

import {TwingNodeBlock} from "../node/block";
import {TwingNodePrint} from "../node/print";
import {TwingNodeBlockReference} from "../node/block-reference";
import {Token, TokenType} from "twig-lexer";

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
export class TwingTokenParserBlock extends TwingTokenParser {
    parse(token: Token): TwingNode {
        let lineno = token.line;
        let columnno = token.column;
        let stream = this.parser.getStream();
        let name = stream.expect(TokenType.NAME).value;

        if (this.parser.hasBlock(name)) {
            throw new TwingErrorSyntax(`The block '${name}' has already been defined line ${this.parser.getBlock(name).getTemplateLine()}.`, stream.getCurrent().line, stream.getSourceContext());
        }

        let block = new TwingNodeBlock(name, new TwingNode(new Map()), lineno, columnno);

        this.parser.setBlock(name, block);
        this.parser.pushLocalScope();
        this.parser.pushBlockStack(name);

        let body;

        if (stream.nextIf(TokenType.TAG_END)) {
            body = this.parser.subparse([this, this.decideBlockEnd], true);

            let token = stream.nextIf(TokenType.NAME);

            if (token) {
                let value = token.value;

                if (value != name) {
                    throw new TwingErrorSyntax(`Expected endblock for block "${name}" (but "${value}" given).`, stream.getCurrent().line, stream.getSourceContext());
                }
            }
        }
        else {
            let nodes = new Map();

            nodes.set(0, new TwingNodePrint(this.parser.parseExpression(), lineno, columnno));

            body = new TwingNode(nodes);
        }

        stream.expect(TokenType.TAG_END);

        block.setNode('body', body);

        this.parser.popBlockStack();
        this.parser.popLocalScope();

        return new TwingNodeBlockReference(name, lineno, columnno, this.getTag());
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endblock');
    }

    getTag() {
        return 'block';
    }
}
