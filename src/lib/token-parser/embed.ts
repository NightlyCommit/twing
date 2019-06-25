import {TwingToken, TwingTokenType} from "../token";
import {TwingTokenParserInclude} from "./include";
import {TwingNodeEmbed} from "../node/embed";
import {TwingNodeModule} from "../node/module";
import {TwingNodeType} from "../node";

export class TwingTokenParserEmbed extends TwingTokenParserInclude {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        let parent = this.parser.parseExpression();

        let embedArguments = this.parseArguments();

        let variables = embedArguments.variables;
        let only = embedArguments.only;
        let ignoreMissing = embedArguments.ignoreMissing;

        let tokensToInject = [
            new TwingToken(TwingTokenType.BLOCK_START, '{%', token.getLine(), token.getColumn()),
            new TwingToken(TwingTokenType.NAME, 'extends', token.getLine(), token.getColumn())
        ];

        // inject a fake parent to make the parent() function work
        let fakeParentToken: TwingToken = new TwingToken(TwingTokenType.STRING, '__parent__', token.getLine(), token.getColumn());
        let parentToken: TwingToken;

        if (parent.getType() === TwingNodeType.EXPRESSION_NAME) {
            parentToken = new TwingToken(TwingTokenType.NAME, parent.getAttribute('name'), token.getLine(), token.getColumn());

            tokensToInject.push(parentToken);
        } else {
            tokensToInject.push(new TwingToken(TwingTokenType.OPENING_QUOTE, '"', token.getLine(), token.getColumn()));

            if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
                parentToken = new TwingToken(TwingTokenType.STRING, parent.getAttribute('value'), token.getLine(), token.getColumn());
            }
            else {
                parentToken = fakeParentToken;
            }

            tokensToInject.push(parentToken);
            tokensToInject.push(new TwingToken(TwingTokenType.CLOSING_QUOTE, '"', token.getLine(), token.getColumn()));
        }

        tokensToInject.push(new TwingToken(TwingTokenType.BLOCK_END, '%}', token.getLine(), token.getColumn()));

        stream.injectTokens(tokensToInject);

        let module = this.parser.parse(stream, [this, this.decideBlockEnd], true);

        // override the parent with the correct one
        if (fakeParentToken === parentToken) {
            module.setNode('parent', parent);
        }

        this.parser.embedTemplate(module as TwingNodeModule);

        stream.expect(TwingTokenType.BLOCK_END);

        return new TwingNodeEmbed(module.getTemplateName(), module.getAttribute('index'), variables, only, ignoreMissing, token.getLine(), token.getColumn(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endembed');
    }

    getTag() {
        return 'embed';
    }
}
