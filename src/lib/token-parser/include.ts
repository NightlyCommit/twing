import {TwingTokenParser} from "../token-parser";
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeInclude} from "../node/include";
import {TwingNodeExpression} from "../node/expression";

export class TwingTokenParserInclude extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.parseExpression();

        let parsedArguments = this.parseArguments();

        return new TwingNodeInclude(expr, parsedArguments.variables, parsedArguments.only, parsedArguments.ignoreMissing, token.getLine(), token.getColumn(), this.getTag());
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

        if (stream.nextIf(TwingTokenType.NAME, 'ignore')) {
            stream.expect(TwingTokenType.NAME, 'missing');

            ignoreMissing = true;
        }

        let variables = null;

        if (stream.nextIf(TwingTokenType.NAME, 'with')) {
            variables = this.parser.parseExpression();
        }

        let only = false;

        if (stream.nextIf(TwingTokenType.NAME, 'only')) {
            only = true;
        }

        stream.expect(TwingTokenType.BLOCK_END);

        return {
            variables: variables,
            only: only,
            ignoreMissing: ignoreMissing
        };
    }
}
