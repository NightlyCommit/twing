import {TwingTokenParserInclude} from "./include";
import {TwingNodeEmbed} from "../node/embed";
import {TwingNodeModule} from "../node/module";
import {TwingNodeType} from "../node";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserEmbed extends TwingTokenParserInclude {
    parse(token: Token) {
        let stream = this.parser.getStream();

        let parent = this.parser.parseExpression();

        let embedArguments = this.parseArguments();

        let variables = embedArguments.variables;
        let only = embedArguments.only;
        let ignoreMissing = embedArguments.ignoreMissing;

        let parentToken;
        let fakeParentToken;

        parentToken = fakeParentToken = new Token(TokenType.STRING, '__parent__', token.line, token.column);

        if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
            parentToken = new Token(TokenType.STRING, parent.getAttribute('value'), token.line, token.column);
        }
        else if (parent.getType() === TwingNodeType.EXPRESSION_NAME) {
            parentToken = new Token(TokenType.NAME, parent.getAttribute('name'), token.line, token.column);
        }

        // inject a fake parent to make the parent() function work
        stream.injectTokens([
            new Token(TokenType.TAG_START, '', token.line, token.column),
            new Token(TokenType.NAME, 'extends', token.line, token.column),
            parentToken,
            new Token(TokenType.TAG_END, '', token.line, token.column),
        ]);

        let module = this.parser.parse(stream, [this, this.decideBlockEnd], true);

        // override the parent with the correct one
        if (fakeParentToken === parentToken) {
            module.setNode('parent', parent);
        }

        this.parser.embedTemplate(module as TwingNodeModule);

        stream.expect(TokenType.TAG_END);

        return new TwingNodeEmbed(module.getTemplateName(), module.getAttribute('index'), variables, only, ignoreMissing, token.line, token.column, this.getTag());
    }

    decideBlockEnd(token: Token) {
        return token.test(TokenType.NAME, 'endembed');
    }

    getTag() {
        return 'embed';
    }
}
