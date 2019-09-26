/**
 * Lexes a template string.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {Lexer, SyntaxError, TokenType} from "twig-lexer";
import {TwingEnvironment} from "./environment";
import {TwingSource} from "./source";
import {TwingTokenStream} from "./token-stream";
import {TwingErrorSyntax} from "./error/syntax";

export const typeToEnglish = (type: TokenType): string => {
    switch (type) {
        case TokenType.EOF:
            return 'end of template';
        case TokenType.TEXT:
            return 'text';
        case TokenType.TAG_START:
            return 'begin of statement block';
        case TokenType.VARIABLE_START:
            return 'begin of print statement';
        case TokenType.TAG_END:
            return 'end of statement block';
        case TokenType.VARIABLE_END:
            return 'end of print statement';
        case TokenType.NAME:
            return 'name';
        case TokenType.NUMBER:
            return 'number';
        case TokenType.STRING:
            return 'string';
        case TokenType.OPERATOR:
            return 'operator';
        case TokenType.PUNCTUATION:
            return 'punctuation';
        case TokenType.INTERPOLATION_START:
            return 'begin of string interpolation';
        case TokenType.INTERPOLATION_END:
            return 'end of string interpolation';
        case TokenType.COMMENT_START:
            return 'begin of comment statement';
        case TokenType.COMMENT_END:
            return 'end of comment statement';
        case TokenType.ARROW:
            return 'arrow function';
        default:
            throw new Error(`Token of type "${type}" does not exist.`)
    }
};

type TwingLexerOptions = {
    interpolation_pair?: [string, string],
    comment_pair?: [string, string],
    tag_pair?: [string, string],
    variable_pair?: [string, string]
};

export class TwingLexer extends Lexer {
    private env: TwingEnvironment;

    constructor(env: TwingEnvironment, options: TwingLexerOptions = {}) {
        super();

        this.env = env;

        if (options.interpolation_pair) {
            this.interpolationPair = options.interpolation_pair;
        }

        if (options.comment_pair) {
            this.commentPair = options.comment_pair;
        }

        if (options.tag_pair) {
            this.tagPair = options.tag_pair;
        }

        if (options.variable_pair) {
            this.variablePair = options.variable_pair;
        }

        // custom operators
        for (let operators of [env.getBinaryOperators(), env.getUnaryOperators()]) {
            for (let [key, operator] of operators) {
                if (!this.operators.includes(key)) {
                    this.operators.push(key);
                }
            }
        }
    }

    tokenizeSource(source: TwingSource): TwingTokenStream {
        try {
            let tokens = this.tokenize(source.getCode());

            return new TwingTokenStream(tokens, source);
        } catch (e) {
            throw new TwingErrorSyntax(e.message, e.line, source, e);
        }
    }
}
