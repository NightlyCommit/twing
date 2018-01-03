import Token, {default as TwingToken} from "./token";
import Source from "./source";
import TokenType from "./token-type";
import TwingSyntaxError from "./error/syntax";

const array_merge = require('locutus/php/array/array_merge');

class TwingTokenStream {
    tokens: Array<Token>;
    current: number = 0;
    source: Source;

    constructor(tokens: Array<Token>, source: Source = null) {
        this.tokens = tokens;
        this.source = source ? source : new Source('', '');
    }

    toString() {
        return this.tokens.join('\n');
    }

    injectTokens(tokens: Array<Token>) {
        this.tokens = array_merge(this.tokens.slice(0, this.current), tokens, this.tokens.slice(this.current));
    }

    /**
     * Sets the pointer to the next token and returns the old one.
     *
     * @return TwingToken
     */
    next() {
        this.current++;

        if (this.current >= this.tokens.length) {
            throw new TwingSyntaxError('Unexpected end of template.', this.tokens[this.current - 1].getLine(), this.source);
        }

        return this.tokens[this.current - 1];
    }

    /**
     * Tests a token, sets the pointer to the next one and returns it or throws a syntax error.
     *
     * @return TwingToken|null The next token if the condition is true, null otherwise
     */
    nextIf(primary: TokenType, secondary: Array<string> | string = null) {
        if (this.tokens[this.current].test(primary, secondary)) {
            return this.next();
        }

        return null;
    }

    /**
     * Tests a token and returns it or throws a syntax error.
     *
     * @return TwingToken
     */
    expect(type: TokenType, value: Array<string> | string | number = null, message: string = null) {
        let token = this.tokens[this.current];

        if (!token.test(type, value)) {
            let line = token.getLine();

            throw new TwingSyntaxError(
                `${message ? message : ''}Unexpected token "${TwingToken.typeToEnglish(token.getType())}" of value "${token.getValue()}" ("${TwingToken.typeToEnglish(type)}" expected${value ? ` with value "${value}"` : ''}).`,
                line,
                this.source
            );
        }

        this.next();

        return token;
    }

    /**
     * Looks at the next token.
     *
     * @param number {number}
     *
     * @return TwingToken
     */
    look(number: number = 1) {
        let index = this.current + number;

        if (index >= this.tokens.length) {
            // throw new Twig_Error_Syntax('Unexpected end of template.', $this->tokens[$this->current + $number - 1]->getLine(), $this->source);
            throw 'Unexpected end of template.';
        }

        return this.tokens[index];
    }

    /**
     * Tests the current token.
     *
     * @return bool
     */
    test(primary: TokenType, secondary: Array<string> | string = null) {
        return this.tokens[this.current].test(primary, secondary);
    }

    /**
     * Checks if end of stream was reached.
     *
     * @return bool
     */
    isEOF() {
        return this.tokens[this.current].getType() === TokenType.EOF_TYPE;
    }

    /**
     * @return TwingToken
     */
    getCurrent() {
        return this.tokens[this.current];
    }

    /**
     * Gets the source associated with this stream.
     *
     * @return TwingSource
     *
     * @internal
     */
    getSourceContext() {
        return this.source;
    }
}

export default TwingTokenStream;