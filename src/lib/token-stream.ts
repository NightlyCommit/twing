import {TwingSource} from "./source";
import {TwingErrorSyntax} from "./error/syntax";
import {Token, TokenStream, TokenType, astVisitor} from "twig-lexer";
import {typeToEnglish} from "./lexer";

export class TwingTokenStream {
    private readonly _stream: TokenStream;
    private readonly _source: TwingSource;

    constructor(tokens: Token[], source: TwingSource = null) {
        this._stream = new TokenStream(tokens);
        this._source = source ? source : new TwingSource('', '');
    }

    private get stream(): TokenStream {
        return this._stream;
    }

    get tokens(): Token[] {
        return this.stream.tokens;
    }

    toString() {
        return this.tokens.map(function (token) {
            return token.toString();
        }).join('\n');
    }

    injectTokens(tokens: Array<Token>) {
        this.stream.injectTokens(tokens);
    }

    next(): Token {
        return this.stream.next()
    }

    nextIf(primary: TokenType, secondary: string[] | string = null): Token {
        return this.stream.nextIf(primary, secondary);
    }

    /**
     * Tests a token and returns it or throws a syntax error.
     *
     * @return {Token}
     */
    expect(type: TokenType, value: string[] | string | number = null, message: string = null): Token {
        let token = this.getCurrent();

        if (!token.test(type, value)) {
            let line = token.line;

            throw new TwingErrorSyntax(
                `${message ? message + '. ' : ''}Unexpected token "${typeToEnglish(token.type)}" of value "${token.value}" ("${typeToEnglish(type)}" expected${value ? ` with value "${value}"` : ''}).`,
                line,
                this._source
            );
        }

        this.next();

        return token;
    }

    look(number: number): Token {
        return this.stream.look(number);
    }

    test(type: TokenType, value: string | number | string[] = null): boolean {
        return this.stream.test(type, value);
    }

    /**
     * Checks if end of stream was reached.
     *
     * @return boolean
     */
    isEOF() {
        return this.stream.current.type === TokenType.EOF;
    }

    toAst(): Token[] {
        return this.stream.traverse((token: Token, stream: TokenStream) => {
            token = astVisitor(token, stream);

            if (token && token.test(TokenType.TEST_OPERATOR)) {
                token = new Token(TokenType.OPERATOR, token.value, token.line, token.column);
            }

            return token;
        });
    }

    getCurrent(): Token {
        return this.stream.current;
    }

    /**
     * Gets the source associated with this stream.
     *
     * @return TwingSource
     */
    getSourceContext() {
        return this._source;
    }
}
