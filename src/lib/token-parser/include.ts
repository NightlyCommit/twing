import {TwingTokenParser} from "../token-parser";
import {TwingNodeInclude} from "../node/include";
import {TwingNodeExpression} from "../node/expression";
import {Token, TokenType} from "twig-lexer";

export class TwingTokenParserInclude extends TwingTokenParser {
    parse(token: Token) {
        let expr = this.parser.parseExpression();

        let parsedArguments = this.parseArguments();

        return new TwingNodeInclude(expr, parsedArguments.variables, parsedArguments.only, parsedArguments.ignoreMissing, token.line, token.column, this.getTag());
    }

    getTag() {
        return 'include';
    }

    /**
     *
     * @returns {{variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean}}
     */
    protected parseArguments(): { variables: TwingNodeExpression; only: boolean; ignoreMissing: boolean } {
        let stream = this.parser.getStream();

        let ignoreMissing = false;

        if (stream.nextIf(TokenType.NAME, 'ignore')) {
            stream.expect(TokenType.NAME, 'missing');

            ignoreMissing = true;
        }

        let variables = null;

        if (stream.nextIf(TokenType.NAME, 'with')) {
            variables = this.parser.parseExpression();
        }

        let only = false;

        if (stream.nextIf(TokenType.NAME, 'only')) {
            only = true;
        }

        stream.expect(TokenType.TAG_END);

        return {
            variables: variables,
            only: only,
            ignoreMissing: ignoreMissing
        };
    }
}
