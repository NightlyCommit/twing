/**
 * Lexes a template string.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingToken} from "./token";
import {TwingSource} from "./source";
import {TwingTokenType} from "./token-type";
import {TwingTokenStream} from "./token-stream";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingEnvironment} from "./environment";
import {TwingLexerState} from "./lexer-state";

let preg_quote = require('locutus/php/pcre/preg_quote');
let ctype_alpha = require('locutus/php/ctype/ctype_alpha');
let merge = require('merge');

let safeCChars: Array<string> = ['b', 'f', 'n', 'r', 't', 'v', '0', '\'', '"', '\\'];

let stripcslashes = function (string: string) {
    return string.replace(/\\(.)/g, function (match, char) {
        if (safeCChars.includes(char)) {
            return new Function('return "' + match + '"')();
        }
        else {
            return char;
        }
    });
};

export class TwingLexer {
    static REGEX_NAME = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;
    static REGEX_NUMBER = /^[0-9]+(?:\.[0-9]+)?/;
    static REGEX_STRING = /^"([^#"\\]*(?:\\.[^#"\\]*)*)"|^'([^'\\]*(?:\\.[^'\\]*)*)'/;
    static REGEX_DQ_STRING_DELIM = /^"/;
    static REGEX_DQ_STRING_PART = /^[^#"\\]*(?:(?:\\\\.|#(?!{))[^#"\\]*)*/;
    static PUNCTUATION = '()[]{}?:.,|';

    brackets: Array<{ value: string, line: number }>;
    code: string;
    currentVarBlockLine: number;
    cursor: number;
    end: number;
    env: TwingEnvironment;
    lineno: number;
    options: {
        interpolation: Array<string>,
        tag_block: Array<string>,
        tag_comment: Array<string>,
        tag_variable: Array<string>,
        whitespace_trim: string
    };
    position: number;
    positions: Array<RegExpExecArray>;
    regexes: {
        interpolation_end: RegExp,
        interpolation_start: RegExp,
        lex_block: RegExp,
        lex_block_line: RegExp,
        lex_block_raw: RegExp,
        lex_comment: RegExp,
        lex_tokens_start: RegExp,
        lex_var: RegExp,
        operator: RegExp,
        lex_raw_data: RegExp
    };
    source: TwingSource;
    state: TwingLexerState;
    states: Array<TwingLexerState>;
    tokens: Array<TwingToken>;

    constructor(env: TwingEnvironment, options: {} = {}) {
        this.env = env;

        this.options = merge({
            interpolation: ['#{', '}'],
            tag_block: ['{%', '%}'],
            tag_comment: ['{#', '#}'],
            tag_variable: ['{{', '}}'],
            whitespace_trim: '-',
        }, options);

        this.regexes = {
            interpolation_end: new RegExp('^\\s*' + this.options.interpolation[1]),
            interpolation_start: new RegExp('^' + this.options.interpolation[0] + '\\s*'),
            lex_block: new RegExp('^\\s*(?:' + this.options.whitespace_trim + this.options.tag_block[1] + '\\s*|^\\s*' + this.options.tag_block[1] + ')\\n?'),
            lex_block_line: new RegExp('^\\s*line\\s+(\\d+)\\s*' + this.options.tag_block[1]),
            lex_block_raw: new RegExp('^\\s*verbatim\\s*(?:' + this.options.whitespace_trim + this.options.tag_block[1] + '\\s*|\\s*' + this.options.tag_block[1] + ')'),
            lex_comment: new RegExp('(?:' + this.options.whitespace_trim + this.options.tag_comment[1] + '\\s*|' + this.options.tag_comment[1] + ')\\n?'),
            lex_raw_data: new RegExp('(' +
                this.options.tag_block[0] + this.options.whitespace_trim
                + '|' +
                this.options.tag_block[0] + ')\\s*(?:endverbatim)\\s*(?:' +
                this.options.whitespace_trim + this.options.tag_block[1] +
                '\\s*|\\s*' +
                this.options.tag_block[1] +
                ')'
            ),
            lex_tokens_start: new RegExp('(' +
                this.options.tag_variable[0] + '|' +
                this.options.tag_block[0] + '|' +
                this.options.tag_comment[0] + ')(' +
                this.options.whitespace_trim + ')?', 'g'
            ),
            lex_var: new RegExp('^\\s*' + this.options.whitespace_trim + this.options.tag_variable[1] + '\\s*|^\\s*' + this.options.tag_variable[1]),
            operator: this.getOperatorRegEx()
        }
    }

    tokenize(source: TwingSource): TwingTokenStream {
        this.source = source;
        this.code = source.getCode().replace(/\r\n|\r/g, '\n');
        this.cursor = 0;
        this.end = this.code.length;
        this.lineno = 1;
        this.tokens = [];
        this.state = TwingLexerState.STATE_DATA;
        this.states = [];
        this.brackets = [];
        this.position = -1;
        this.positions = [];

        // find all token starts in one go
        let match: RegExpExecArray;

        while ((match = this.regexes.lex_tokens_start.exec(this.code)) !== null) {
            this.positions.push(match);
        }

        while (this.cursor < this.end) {
            // dispatch to the lexing functions depending on the current state

            // https://stackoverflow.com/questions/45197320/typescript-switch-statement-throws-not-comparable-to-type-error
            switch (+this.state) {
                case TwingLexerState.STATE_DATA:
                    this.lexData();
                    break;
                case TwingLexerState.STATE_BLOCK:
                    this.lexBlock();
                    break;
                case TwingLexerState.STATE_VAR:
                    this.lexVar();
                    break;
                case TwingLexerState.STATE_STRING:
                    this.lexString();
                    break;
                case TwingLexerState.STATE_INTERPOLATION:
                    this.lexInterpolation();
                    break;
            }
        }

        this.pushTwingToken(TwingTokenType.EOF_TYPE);

        if (this.brackets.length > 0) {
            let bracket = this.brackets.pop();

            let expect = bracket.value;
            let lineno = bracket.line;

            throw new TwingErrorSyntax(`Unclosed "${expect}".`, lineno, this.source);
        }

        return new TwingTokenStream(this.tokens, this.source);
    }

    private lexData() {
        // if no matches are left we return the rest of the template as simple text token
        if (this.position === (this.positions.length - 1)) {
            this.pushTwingToken(TwingTokenType.TEXT_TYPE, this.code.substring(this.cursor));
            this.cursor = this.end;

            return;
        }

        // Find the first token after the current cursor
        let position: RegExpExecArray = this.positions[++this.position];

        while (position.index < this.cursor) {
            if (this.position == (this.positions.length - 1)) {
                return;
            }

            position = this.positions[++this.position];
        }

        // push the template text first
        let text;
        let textContent;

        text = textContent = this.code.substr(this.cursor, position.index - this.cursor);

        if (this.positions[this.position][2]) {
            text = text.trimRight();
        }

        this.pushTwingToken(TwingTokenType.TEXT_TYPE, text);
        this.moveCursor(textContent + position[0]);

        switch (position[1]) {
            case this.options.tag_comment[0]:
                this.lexComment();
                break;
            case this.options.tag_block[0]:
                // raw data?
                let match: RegExpExecArray;

                if ((match = this.regexes.lex_block_raw.exec(this.code.substring(this.cursor))) !== null) {
                    this.moveCursor(match[0]);
                    this.lexRawData();
                    // {% line \d+ %}
                }
                else if ((match = this.regexes.lex_block_line.exec(this.code.substring(this.cursor))) !== null) {
                    this.moveCursor(match[0]);
                    this.lineno = parseInt(match[1]);
                }
                else {
                    this.pushTwingToken(TwingTokenType.BLOCK_START_TYPE);
                    this.pushState(TwingLexerState.STATE_BLOCK);
                    this.currentVarBlockLine = this.lineno;
                }
                break;
            case this.options.tag_variable[0]:
                this.pushTwingToken(TwingTokenType.VAR_START_TYPE);
                this.pushState(TwingLexerState.STATE_VAR);
                this.currentVarBlockLine = this.lineno;
                break;
        }
    }

    private lexBlock() {
        let string: string = this.code.substring(this.cursor);
        let match: RegExpExecArray;

        if ((this.brackets.length < 1) && ((match = this.regexes.lex_block.exec(string)) !== null)) {
            this.pushTwingToken(TwingTokenType.BLOCK_END_TYPE);
            this.moveCursor(match[0]);
            this.popState();
        }
        else {
            this.lexExpression();
        }
    }

    private lexVar() {
        let match: RegExpExecArray;

        if ((this.brackets.length < 1) && ((match = this.regexes.lex_var.exec(this.code.substring(this.cursor))) !== null)) {
            this.pushTwingToken(TwingTokenType.VAR_END_TYPE);
            this.moveCursor(match[0]);
            this.popState();
        } else {
            this.lexExpression();
        }
    }

    private lexExpression() {
        let match: RegExpExecArray;
        let candidate: string = this.code.substring(this.cursor);
        let punctuationCandidate: string;

        // whitespace
        if ((match = /^\s+/.exec(candidate)) !== null) {
            this.moveCursor(match[0]);

            if (this.cursor >= this.end) {
                throw new TwingErrorSyntax(`Unclosed "${this.state === TwingLexerState.STATE_BLOCK ? 'block' : 'variables'}".`, this.currentVarBlockLine, this.source);
            }
        }

        candidate = this.code.substring(this.cursor);
        punctuationCandidate = candidate.substr(0, 1);

        // operators
        if ((match = this.regexes.operator.exec(candidate)) !== null) {
            let tokenValue = match[0].replace(/\s+/, ' ');

            this.pushTwingToken(TwingTokenType.OPERATOR_TYPE, tokenValue);
            this.moveCursor(match[0]);
        }
        // names
        else if ((match = TwingLexer.REGEX_NAME.exec(candidate)) !== null) {
            this.pushTwingToken(TwingTokenType.NAME_TYPE, match[0]);
            this.moveCursor(match[0]);
        }
        // numbers
        else if ((match = TwingLexer.REGEX_NUMBER.exec(candidate)) !== null) {
            this.pushTwingToken(TwingTokenType.NUMBER_TYPE, Number(match[0]));
            this.moveCursor(match[0]);
        }
        // punctuation
        else if (TwingLexer.PUNCTUATION.indexOf(punctuationCandidate) > -1) {
            // opening bracket
            if ('([{'.indexOf(punctuationCandidate) > -1) {
                this.brackets.push({
                    value: punctuationCandidate,
                    line: this.lineno
                });
            }
            // closing bracket
            else if (')]}'.indexOf(punctuationCandidate) > -1) {
                if (this.brackets.length < 1) {
                    throw new TwingErrorSyntax(`Unexpected "${punctuationCandidate}"`, this.lineno, this.source);
                }

                let bracket = this.brackets.pop();

                let lineno = bracket.line;

                let expect = bracket.value
                    .replace('(', ')')
                    .replace('[', ']')
                    .replace('{', '}')
                ;

                if (punctuationCandidate != expect) {
                    throw new TwingErrorSyntax(`Unclosed "${expect}."`, lineno, this.source);
                }
            }

            this.pushTwingToken(TwingTokenType.PUNCTUATION_TYPE, punctuationCandidate);

            this.cursor++;
        }
        // strings
        else if ((match = TwingLexer.REGEX_STRING.exec(candidate)) !== null) {
            this.pushTwingToken(TwingTokenType.STRING_TYPE, stripcslashes(match[0].slice(1, -1)));
            this.moveCursor(match[0]);
        }
        // opening double quoted string
        else if ((match = TwingLexer.REGEX_DQ_STRING_DELIM.exec(candidate)) !== null) {
            this.brackets.push({
                value: '"',
                line: this.lineno
            });
            this.pushState(TwingLexerState.STATE_STRING);
            this.moveCursor(match[0]);
        }
        // unlexable
        else {
            throw new TwingErrorSyntax(
                `Unexpected character "${candidate}" in "${this.code}"`,
                this.lineno,
                this.source
            );
        }
    }

    private lexRawData() {
        let match: RegExpExecArray = this.regexes.lex_raw_data.exec(this.code.substring(this.cursor));

        if (!match) {
            throw new TwingErrorSyntax('Unexpected end of file: Unclosed "verbatim" block.', this.lineno, this.source);
        }

        let text = this.code.substr(this.cursor, match.index);

        this.moveCursor(text + match[0]);

        if (match[1].indexOf(this.options.whitespace_trim) > -1) {
            text = text.trimRight();
        }

        this.pushTwingToken(TwingTokenType.TEXT_TYPE, text);
    }

    private lexComment() {
        let match = this.regexes.lex_comment.exec(this.code.substring(this.cursor));

        if (!match) {
            throw new TwingErrorSyntax('Unclosed comment.', this.lineno, this.source);
        }

        this.moveCursor(this.code.substr(this.cursor, match.index) + match[0]);
    }

    private lexString() {
        let match: RegExpExecArray;

        if ((match = this.regexes.interpolation_start.exec(this.code.substring(this.cursor))) !== null) {
            this.brackets.push({
                value: this.options.interpolation[0],
                line: this.lineno
            });
            this.pushTwingToken(TwingTokenType.INTERPOLATION_START_TYPE);
            this.moveCursor(match[0]);
            this.pushState(TwingLexerState.STATE_INTERPOLATION);
        }
        else if (((match = TwingLexer.REGEX_DQ_STRING_PART.exec(this.code.substring(this.cursor))) !== null) && (match[0].length > 0)) {
            this.pushTwingToken(TwingTokenType.STRING_TYPE, stripcslashes(match[0]));
            this.moveCursor(match[0]);
        }
        else if ((TwingLexer.REGEX_DQ_STRING_DELIM.exec(this.code.substring(this.cursor))) !== null) {
            let {value: expect, line: lineno} = this.brackets.pop();

            if (this.code.substr(this.cursor, 1) != '"') {
                throw new TwingErrorSyntax(`Unclosed "%${expect}".`, lineno, this.source);
            }

            this.popState();
            this.cursor++;
        }
    }

    private lexInterpolation() {
        let match: RegExpExecArray;
        let bracket = this.brackets[this.brackets.length - 1];

        if (this.options.interpolation[0] === bracket.value && (match = this.regexes.interpolation_end.exec(this.code.substring(this.cursor))) !== null) {
            this.brackets.pop();
            this.pushTwingToken(TwingTokenType.INTERPOLATION_END_TYPE);
            this.moveCursor(match[0]);
            this.popState();
        } else {
            this.lexExpression();
        }
    }

    private moveCursor(text: string) {
        this.cursor += text.length;

        this.lineno += (text.split('\n').length - 1);
    }

    private getOperatorRegEx() {
        let operators = Array.from([
            ...['='],
            ...this.env.getUnaryOperators().keys(),
            ...this.env.getBinaryOperators().keys()
        ]);

        operators.sort(function (a, b) {
            return a.length > b.length ? -1 : 1;
        });

        let patterns: Array<string> = [];

        operators.forEach(function (operator) {
            let length: number = operator.length;
            let pattern: string;

            // an operator that ends with a character must be followed by
            // a whitespace or a parenthesis
            if (ctype_alpha(operator[length - 1])) {
                pattern = preg_quote(operator, '/') + '(?=[\\s()])';
            }
            else {
                pattern = preg_quote(operator, '/');
            }

            // an operator with a space can be any amount of whitespaces
            pattern = pattern.replace(/\s+/, '\\s+');

            patterns.push('^' + pattern);
        });

        return new RegExp(patterns.join('|'));
    };

    private pushTwingToken(type: TwingTokenType, value: any = null) {
        if ((type === TwingTokenType.TEXT_TYPE) && (value.length < 1)) {
            return;
        }

        this.tokens.push(new TwingToken(type, value, this.lineno));
    }

    private pushState(state: TwingLexerState) {
        this.states.push(this.state);
        this.state = state;
    }

    /**
     * @return TwingLexerState
     */
    private popState() {
        if (this.states.length === 0) {
            throw new Error('Cannot pop state without a previous state.');
        }

        this.state = this.states.pop();
    }
}
