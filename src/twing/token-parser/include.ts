import {TwingTokenParser} from "../token-parser";
import {TwingToken} from "../token";
import {TwingNodeInclude} from "../node/include";
import {TwingNodeExpression} from "../node/expression";

export class TwingTokenParserInclude extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.getExpressionParser().parseExpression();

        let parsedArguments = this.parseArguments();

        return new TwingNodeInclude(expr, parsedArguments.variables, parsedArguments.only, parsedArguments.ignoreMissing, token.getLine(), this.getTag());
    }

    getTag() {
        return 'include';
    }

    /**
     *
     * @returns {{variables: TwingNodeExpression; only: boolean; ignoreMissing: boolean}}
     */
    protected parseArguments(): { variables: TwingNodeExpression; only: boolean; ignoreMissing: boolean } {
        let stream = this.parser.getStream();

        let ignoreMissing = false;

        if (stream.nextIf(TwingToken.NAME_TYPE, 'ignore')) {
            stream.expect(TwingToken.NAME_TYPE, 'missing');

            ignoreMissing = true;
        }

        let variables = null;

        if (stream.nextIf(TwingToken.NAME_TYPE, 'with')) {
            variables = this.parser.getExpressionParser().parseExpression();
        }

        let only = false;

        if (stream.nextIf(TwingToken.NAME_TYPE, 'only')) {
            only = true;
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        return {
            variables: variables,
            only: only,
            ignoreMissing: ignoreMissing
        };
    }
}
