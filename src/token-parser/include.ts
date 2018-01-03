import TwingTokenParser from "../token-parser";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeInclude from "../node/include";

class TwingTokenParserInclude extends TwingTokenParser {
    parse(token: TwingToken) {
        let expr = this.parser.getExpressionParser().parseExpression();

        let parsedArguments = this.parseArguments();

        return new TwingNodeInclude(expr, parsedArguments.variables, parsedArguments.only, parsedArguments.ignoreMissing, token.getLine(), this.getTag());
    }

    /**
     *
     * @return {{variables: any; only: boolean; ignoreMissing: boolean}}
     */
    protected parseArguments() {
        let stream = this.parser.getStream();

        let ignoreMissing = false;

        if (stream.nextIf(TwingTokenType.NAME_TYPE, 'ignore')) {
            stream.expect(TwingTokenType.NAME_TYPE, 'missing');

            ignoreMissing = true;
        }

        let variables = null;

        if (stream.nextIf(TwingTokenType.NAME_TYPE, 'with')) {
            variables = this.parser.getExpressionParser().parseExpression();
        }

        let only = false;

        if (stream.nextIf(TwingTokenType.NAME_TYPE, 'only')) {
            only = true;
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        return {
            variables: variables,
            only: only,
            ignoreMissing: ignoreMissing
        };
    }

    getTag() {
        return 'include';
    }
}

export = TwingTokenParserInclude;