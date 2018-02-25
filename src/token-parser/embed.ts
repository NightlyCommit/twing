import {TwingToken} from "../token";
import {TwingTokenType} from "../token-type";
import {TwingTokenParserInclude} from "./include";
import {TwingNodeEmbed} from "../node/embed";
import {TwingNodeModule} from "../node/module";
import {TwingNodeType} from "../node-type";

export class TwingTokenParserEmbed extends TwingTokenParserInclude {
    parse(token: TwingToken) {
        let stream = this.parser.getStream();

        let parent = this.parser.getExpressionParser().parseExpression();

        let embedArguments = this.parseArguments();

        let variables = embedArguments.variables;
        let only = embedArguments.only;
        let ignoreMissing = embedArguments.ignoreMissing;

        let parentToken;
        let fakeParentToken;

        parentToken = fakeParentToken = new TwingToken(TwingTokenType.STRING_TYPE, '__parent__', token.getLine());

        if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
            parentToken = new TwingToken(TwingTokenType.STRING_TYPE, parent.getAttribute('value'), token.getLine());
        }
        else if (parent.getType() === TwingNodeType.EXPRESSION_NAME) {
            parentToken = new TwingToken(TwingTokenType.NAME_TYPE, parent.getAttribute('name'), token.getLine());
        }

        // inject a fake parent to make the parent() function work
        stream.injectTokens([
            new TwingToken(TwingTokenType.BLOCK_START_TYPE, '', token.getLine()),
            new TwingToken(TwingTokenType.NAME_TYPE, 'extends', token.getLine()),
            parentToken,
            new TwingToken(TwingTokenType.BLOCK_END_TYPE, '', token.getLine()),
        ]);

        let module = this.parser.parse(stream, [this, this.decideBlockEnd], true);

        // override the parent with the correct one
        if (fakeParentToken === parentToken) {
            module.setNode('parent', parent);
        }

        this.parser.embedTemplate(module as TwingNodeModule);

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodeEmbed(module.getTemplateName(), module.getAttribute('index'), variables, only, ignoreMissing, token.getLine(), this.getTag());
    }

    decideBlockEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endembed');
    }

    getTag() {
        return 'embed';
    }
}
