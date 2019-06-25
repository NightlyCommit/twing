import {TwingToken, TwingTokenType} from "./token";
import {TwingSource} from "./source";
import {TwingErrorSyntax} from "./error/syntax";

const array_merge = require('locutus/php/array/array_merge');

const safeCChars: Array<string> = ['b', 'f', 'n', 'r', 't', 'v', '0', '\'', '"', '\\'];

const stripcslashes = function (string: string) {
    return string.replace(/\\(.)/g, function (match, char) {
        if (safeCChars.includes(char)) {
            return new Function('return "' + match + '"')();
        } else {
            return char;
        }
    });
};

export class TwingTokenStream {
    private tokens: Array<TwingToken>;
    private current: number = 0;
    readonly source: TwingSource;

    constructor(tokens: Array<TwingToken>, source: TwingSource = null) {
        this.tokens = tokens;
        this.source = source ? source : new TwingSource('', '');
    }

    toString() {
        return this.tokens.map(function (token: TwingToken) {
            return token.toString();
        }).join('\n');
    }

    /**
     * Serialize the stream to a Twig string.
     *
     * @return string
     */
    serialize() {
        return this.tokens.map(function (token: TwingToken) {
            return token.serialize();
        }).join('');
    }

    /**
     * @return TwingTokenStream
     */
    toAst(): TwingTokenStream {
        let tokens: TwingToken[] = [];

        while (!this.isEOF()) {
            let current: TwingToken = this.getCurrent();

            if (!this.test(TwingTokenType.WHITESPACE) &&
                !this.test(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING) &&
                !this.test(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING)) {
                let tokenContent: string = current.getContent();

                if (this.test(TwingTokenType.TEXT) || this.test(TwingTokenType.STRING)) {
                    // strip C slashes
                    tokenContent = stripcslashes(tokenContent);
                    // streamline line separators
                    tokenContent = tokenContent.replace(/\r\n|\r/g, '\n');
                }
                else if (this.test(TwingTokenType.OPERATOR)) {
                    // remove unnecessary operator spaces
                    tokenContent = tokenContent.replace(/\s+/, ' ');
                }

                // handle whitespace control modifiers
                let wstCandidate: TwingToken = this.look(2, false);

                if (wstCandidate && wstCandidate.getType() === TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING) {
                    tokenContent = tokenContent.replace(/\s*$/, '');
                }

                wstCandidate = this.look(-2, false);

                if (wstCandidate && wstCandidate.getType() === TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING) {
                    tokenContent = tokenContent.replace(/^\s*/, '');
                }

                // don't push empty TEXT tokens
                if (!this.test(TwingTokenType.TEXT) || (tokenContent.length > 0)) {
                    tokens.push(new TwingToken(current.getType(), tokenContent, current.getLine(), current.getColumn()));
                }
            }

            this.next();
        }

        // EOF
        let current: TwingToken = this.getCurrent();

        tokens.push(new TwingToken(
            current.getType(),
            current.getContent(),
            current.getLine(),
            current.getColumn()
        ));

        return new TwingTokenStream(tokens, this.source);
    }

    /**
     * Inject tokens after the current one.
     *
     * @param tokens
     */
    injectTokens(tokens: Array<TwingToken>) {
        this.tokens = array_merge(this.tokens.slice(0, this.current), tokens, this.tokens.slice(this.current));
    }

    rewind() {
        this.current = 0;
    }

    /**
     * Sets the pointer to the next token and returns the old one.
     *
     * @return TwingToken
     */
    next() {
        this.current++;

        if (this.current >= this.tokens.length) {
            throw new TwingErrorSyntax('Unexpected end of template.', this.tokens[this.current - 1].getLine(), this.source);
        }

        return this.tokens[this.current - 1];
    }

    /**
     * Tests a token, sets the pointer to the next one and returns it.
     *
     * @return TwingToken|null The next token if the condition is true, null otherwise
     */
    nextIf(primary: TwingTokenType, secondary: Array<string> | string = null) {
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
    expect(type: TwingTokenType, content: Array<string> | string | number = null, message: string = null) {
        let token = this.tokens[this.current];

        if (!token.test(type, content)) {
            let line = token.getLine();

            throw new TwingErrorSyntax(
                `${message ? message + '. ' : ''}Unexpected token "${TwingToken.typeToEnglish(token.getType())}" of value "${token.getContent()}" ("${TwingToken.typeToEnglish(type)}" expected${content ? ` with value "${content}"` : ''}).`,
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
     * @param {number} number
     * @param {boolean} throw_
     *
     * @return TwingToken
     */
    look(number: number = 1, throw_: boolean = true) {
        let index = this.current + number;

        if (index >= this.tokens.length) {
            if (throw_) {
                throw new TwingErrorSyntax('Unexpected end of template.', this.tokens[this.current + number - 1].getLine(), this.source);
            }
        }

        return this.tokens[index];
    }

    /**
     * Tests the active token.
     *
     * @return bool
     */
    test(primary: TwingTokenType, secondary: Array<string> | string = null) {
        return this.tokens[this.current].test(primary, secondary);
    }

    /**
     * Checks if end of stream was reached.
     *
     * @return bool
     */
    isEOF() {
        return this.tokens[this.current].getType() === TwingTokenType.EOF;
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

    /**
     * @return TwingToken[]
     */
    getTokens(): TwingToken[] {
        return this.tokens;
    }
}
