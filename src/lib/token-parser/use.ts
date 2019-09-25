import {TwingTokenParser} from "../token-parser";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNode, TwingNodeType} from "../node";
import {Token, TokenType} from "twig-lexer";


export class TwingTokenParserUse extends TwingTokenParser {
    parse(token: Token) {
        let template = this.parser.parseExpression();
        let stream = this.parser.getStream();

        if (template.getType() !== TwingNodeType.EXPRESSION_CONSTANT) {
            throw new TwingErrorSyntax('The template references in a "use" statement must be a string.', stream.getCurrent().line, stream.getSourceContext());
        }

        let targets = new Map();

        if (stream.nextIf(TokenType.NAME, 'with')) {
            do {
                let name = stream.expect(TokenType.NAME).value;
                let alias = name;

                if (stream.nextIf(TokenType.NAME, 'as')) {
                    alias = stream.expect(TokenType.NAME).value;
                }

                targets.set(name, new TwingNodeExpressionConstant(alias, token.line, token.column));

                if (!stream.nextIf(TokenType.PUNCTUATION, ',')) {
                    break;
                }
            } while (true);
        }

        stream.expect(TokenType.TAG_END);

        this.parser.addTrait(new TwingNode(new Map([['template', template], ['targets', new TwingNode(targets)]])));

        return new TwingNode();
    }

    getTag() {
        return 'use';
    }
}
