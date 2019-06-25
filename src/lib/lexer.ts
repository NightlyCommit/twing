/**
 * Lexes a template string.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingToken, TwingTokenType} from "./token";
import {TwingSource} from "./source";
import {TwingTokenStream} from "./token-stream";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingExtensionSet} from "./extension-set";
import {TwingEnvironment} from "./environment";

let preg_quote = require('locutus/php/pcre/preg_quote');
let merge = require('merge');

export class TwingLexer {
    static STATE_DATA = 0;
    static STATE_BLOCK = 1;
    static STATE_VAR = 2;
    static STATE_STRING = 3;
    static STATE_INTERPOLATION = 4;

    static REGEX_NAME = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;
    static REGEX_NUMBER = /^[0-9]+(?:\.[0-9]+)?/;
    static REGEX_STRING = /^(")([^#"\\]*(?:\\.[^#"\\]*)*)(")|^(')([^'\\]*(?:\\.[^'\\]*)*)(')/;
    static REGEX_DQ_STRING_DELIM = /^"/;
    static REGEX_DQ_STRING_PART = /^[^#"\\]*(?:(?:\\\\.|#(?!{))[^#"\\]*)*/;
    static PUNCTUATION = '()[]{}?:.,|';
    static LINE_SEPARATORS = ['\\r\\n', '\\r' ,'\\n'];

    private brackets: Array<{ value: string, line: number }>;
    private code: string;
    private currentVarBlockLine: number;
    private currentBlockName: string;
    private cursor: number;
    private end: number;
    private env: TwingEnvironment;
    private lineno: number; // 1-based
    private columnno: number; // 1-based
    private options: {
        interpolation: Array<string>,
        tag_block: Array<string>,
        tag_comment: Array<string>,
        tag_variable: Array<string>,
        whitespace_trim: string,
        line_whitespace_trim: string
    };
    private position: number;
    private positions: Array<RegExpExecArray>;
    private regexes: {
        interpolation_end: RegExp,
        interpolation_start: RegExp,
        lex_block: RegExp,
        lex_block_raw: RegExp,
        lex_comment: RegExp,
        lex_raw_data: RegExp,
        lex_tokens_start: RegExp,
        lex_var: RegExp,
        operator: RegExp,
        whitespace: RegExp
    };
    private source: TwingSource;
    private state: number;
    private states: Array<number>;
    private tokens: Array<TwingToken>;

    constructor(env: TwingEnvironment, options: {} = {}) {
        this.env = env;

        this.options = merge({
            interpolation: ['#{', '}'],
            tag_block: ['{%', '%}'],
            tag_comment: ['{#', '#}'],
            tag_variable: ['{{', '}}'],
            whitespace_trim: '-',
            line_whitespace_trim: '~',
        }, options);

        this.regexes = {
            interpolation_start: new RegExp('^(' + this.options.interpolation[0] + ')(\\s*)'),
            interpolation_end: new RegExp('^(\\s*)(' + this.options.interpolation[1] + ')'),
            lex_block: new RegExp(
                '^(' + this.options.whitespace_trim + '?)(' + this.options.tag_block[1] + '(?:' + TwingLexer.LINE_SEPARATORS.join('|') + ')?)'
            ),
            lex_block_raw: new RegExp(
                '^(\\s*)(verbatim)(\\s*)(' + this.options.whitespace_trim + '?)(' + this.options.tag_block[1] + ')'
            ),
            lex_comment: new RegExp(
                '(\\s*)(' + this.options.whitespace_trim + '?)(' + this.options.tag_comment[1] + '(?:' + TwingLexer.LINE_SEPARATORS.join('|') + ')?)'
            ),
            lex_raw_data: new RegExp(
                '(' + this.options.tag_block[0] + ')(' + this.options.whitespace_trim + '?)' +
                '(\\s*)(endverbatim)(\\s*)' +
                '(' + this.options.whitespace_trim + '?)(' + this.options.tag_block[1] + ')'
            ),
            lex_tokens_start: new RegExp('(' +
                this.options.tag_variable[0] + '|' +
                this.options.tag_block[0] + '|' +
                this.options.tag_comment[0] + ')(' +
                this.options.whitespace_trim + ')?', 'g'
            ),
            lex_var: new RegExp('^(' + this.options.whitespace_trim + '?)(' + this.options.tag_variable[1] + ')'),
            operator: this.getOperatorRegEx(),
            whitespace: new RegExp('^\\s+')
        };
    }

    tokenize(source: TwingSource): TwingTokenStream {
        this.source = source;

        if (typeof source.getCode() !== 'string') {
            this.code = '';
        } else {
            this.code = source.getCode();
        }

        this.cursor = 0;
        this.end = this.code.length;
        this.lineno = 1;
        this.columnno = 1;
        this.tokens = [];
        this.state = TwingLexer.STATE_DATA;
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
            switch (this.state) {
                case TwingLexer.STATE_DATA:
                    this.lexData();
                    break;
                case TwingLexer.STATE_BLOCK:
                    this.lexBlock();
                    break;
                case TwingLexer.STATE_VAR:
                    this.lexVar();
                    break;
                case TwingLexer.STATE_STRING:
                    this.lexString();
                    break;
                case TwingLexer.STATE_INTERPOLATION:
                    this.lexInterpolation();
                    break;
            }
        }

        this.pushToken(TwingTokenType.EOF, null);

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
            let text = this.code.substring(this.cursor);

            this.pushToken(TwingTokenType.TEXT, text);
            this.moveCursor(text);

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
        let text: string = this.code.substr(this.cursor, position.index - this.cursor);

        this.pushToken(TwingTokenType.TEXT, text);
        this.moveCursor(text);

        let tag = position[1];
        let modifier = position[2];

        this.moveCursor(tag + (modifier ? modifier : ''));

        switch (tag) {
            case this.options.tag_comment[0]:
                this.pushToken(TwingTokenType.COMMENT_START, tag);
                this.pushWhitespaceTrimToken(modifier);
                this.lexComment();
                break;
            case this.options.tag_block[0]:
                // raw data?
                let match: RegExpExecArray;

                if ((match = this.regexes.lex_block_raw.exec(this.code.substring(this.cursor))) !== null) {
                    this.pushToken(TwingTokenType.BLOCK_START, tag);
                    this.pushWhitespaceTrimToken(modifier);
                    this.pushToken(TwingTokenType.WHITESPACE, match[1]);
                    this.pushToken(TwingTokenType.NAME, match[2]); // verbatim itself
                    this.pushToken(TwingTokenType.WHITESPACE, match[3]);
                    this.pushWhitespaceTrimToken(match[4]);
                    this.pushToken(TwingTokenType.BLOCK_END, match[5]);

                    this.moveCursor(match[0]);
                    this.lexVerbatim();
                } else {
                    this.pushToken(TwingTokenType.BLOCK_START, tag);
                    this.pushWhitespaceTrimToken(modifier);
                    this.pushState(TwingLexer.STATE_BLOCK);
                    this.currentVarBlockLine = this.lineno;
                }
                break;
            case this.options.tag_variable[0]:
                this.pushToken(TwingTokenType.VAR_START, tag);
                this.pushWhitespaceTrimToken(modifier);
                this.pushState(TwingLexer.STATE_VAR);
                this.currentVarBlockLine = this.lineno;
                break;
        }
    }

    private lexBlock() {
        this.lexWhitespace();

        let code: string = this.code.substring(this.cursor);
        let match: RegExpExecArray;

        if ((this.brackets.length < 1) && ((match = this.regexes.lex_block.exec(code)) !== null)) {
            let tag = match[2];
            let modifier = match[1];

            this.pushWhitespaceTrimToken(modifier);
            this.pushToken(TwingTokenType.BLOCK_END, tag);
            this.moveCursor(tag + (modifier ? modifier : ''));

            this.popState();
        } else {
            this.lexExpression();
        }
    }

    private lexVar() {
        this.lexWhitespace();

        let match: RegExpExecArray;

        if ((this.brackets.length < 1) && ((match = this.regexes.lex_var.exec(this.code.substring(this.cursor))) !== null)) {
            this.pushWhitespaceTrimToken(match[1]);
            this.pushToken(TwingTokenType.VAR_END, match[2]);
            this.moveCursor(match[0]);
            this.popState();
        } else {
            this.lexExpression();
        }
    }

    private lexWhitespace() {
        let match: RegExpExecArray;
        let candidate: string = this.code.substring(this.cursor);

        // whitespace
        if ((match = this.regexes.whitespace.exec(candidate)) !== null) {
            let content = match[0];

            this.pushToken(TwingTokenType.WHITESPACE, content);
            this.moveCursor(content);

            if (this.cursor >= this.end) {
                throw new TwingErrorSyntax(`Unclosed "${this.state === TwingLexer.STATE_BLOCK ? 'block' : 'variable'}".`, this.currentVarBlockLine, this.source);
            }
        }
    }

    private lexExpression() {
        this.lexWhitespace();

        let match: RegExpExecArray;
        let candidate: string = this.code.substring(this.cursor);
        let punctuationCandidate: string;

        punctuationCandidate = candidate.substr(0, 1);

        // operators
        if ((match = this.regexes.operator.exec(candidate)) !== null) {
            this.pushToken(TwingTokenType.OPERATOR, match[0]);
            this.moveCursor(match[0]);
        }
        // names
        else if ((match = TwingLexer.REGEX_NAME.exec(candidate)) !== null) {
            let content = match[0];

            if (this.state === TwingLexer.STATE_BLOCK) {
                this.currentBlockName = content;
            }

            this.pushToken(TwingTokenType.NAME, content);
            this.moveCursor(content);
        }
        // numbers
        else if ((match = TwingLexer.REGEX_NUMBER.exec(candidate)) !== null) {
            this.pushToken(TwingTokenType.NUMBER, match[0]);
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
                    throw new TwingErrorSyntax(`Unexpected "${punctuationCandidate}".`, this.lineno, this.source);
                }

                let bracket = this.brackets.pop();

                let lineno = bracket.line;

                let expect = bracket.value
                    .replace('(', ')')
                    .replace('[', ']')
                    .replace('{', '}')
                ;

                if (punctuationCandidate != expect) {
                    throw new TwingErrorSyntax(`Unclosed "${expect}".`, lineno, this.source);
                }
            }

            this.pushToken(TwingTokenType.PUNCTUATION, punctuationCandidate);
            this.moveCursor(punctuationCandidate);
        }
        // strings
        else if ((match = TwingLexer.REGEX_STRING.exec(candidate)) !== null) {
            let openingBracket = match[1] || match[4];
            let content = match[2] || match[5];
            let closingBracket = match[3] || match[6];


            this.pushToken(TwingTokenType.OPENING_QUOTE, openingBracket);
            this.moveCursor(openingBracket);

            if (content !== undefined) {
                this.pushToken(TwingTokenType.STRING, content);
                this.moveCursor(content);
            }

            this.pushToken(TwingTokenType.CLOSING_QUOTE, closingBracket);
            this.moveCursor(closingBracket);
        }
        // opening double quoted string
        else if ((match = TwingLexer.REGEX_DQ_STRING_DELIM.exec(candidate)) !== null) {
            this.brackets.push({
                value: match[0],
                line: this.lineno
            });

            this.pushToken(TwingTokenType.OPENING_QUOTE, match[0]);
            this.pushState(TwingLexer.STATE_STRING);
            this.moveCursor(match[0]);
        }
        // unlexable
        else {
            throw new TwingErrorSyntax(
                `Unexpected character "${candidate}" in "${this.code}".`,
                this.lineno,
                this.source
            );
        }
    }

    private lexVerbatim() {
        let match: RegExpExecArray = this.regexes.lex_raw_data.exec(this.code.substring(this.cursor));

        if (!match) {
            throw new TwingErrorSyntax('Unexpected end of file: unclosed "verbatim" block.', this.lineno, this.source);
        }

        let text = this.code.substr(this.cursor, match.index);

        this.pushToken(TwingTokenType.TEXT, text);

        this.pushToken(TwingTokenType.BLOCK_START, match[1]);
        this.pushWhitespaceTrimToken(match[2]);
        this.pushToken(TwingTokenType.WHITESPACE, match[3]);
        this.pushToken(TwingTokenType.NAME, match[4]); // endverbatim itself
        this.pushToken(TwingTokenType.WHITESPACE, match[5]);
        this.pushWhitespaceTrimToken(match[6]);
        this.pushToken(TwingTokenType.BLOCK_END, match[7]);

        this.moveCursor(text + match[0]);
    }

    private lexComment() {
        this.lexWhitespace();

        let match = this.regexes.lex_comment.exec(this.code.substring(this.cursor));

        if (!match) {
            throw new TwingErrorSyntax('Unclosed comment.', this.lineno, this.source);
        }

        let text = this.code.substr(this.cursor, match.index);

        this.pushToken(TwingTokenType.TEXT, text);
        this.moveCursor(text);

        this.lexWhitespace();

        this.pushWhitespaceTrimToken(match[2]);

        this.pushToken(TwingTokenType.COMMENT_END, match[3]);
        this.moveCursor(match[3]);
    }

    private lexString() {
        let match: RegExpExecArray;

        if ((match = this.regexes.interpolation_start.exec(this.code.substring(this.cursor))) !== null) {
            let tag = match[1];
            let whitespace = match[2];

            this.brackets.push({
                value: tag,
                line: this.lineno
            });

            this.pushToken(TwingTokenType.INTERPOLATION_START, tag);
            this.pushToken(TwingTokenType.WHITESPACE, whitespace);
            this.moveCursor(tag + (whitespace ? whitespace : ''));
            this.pushState(TwingLexer.STATE_INTERPOLATION);
        } else if (((match = TwingLexer.REGEX_DQ_STRING_PART.exec(this.code.substring(this.cursor))) !== null) && (match[0].length > 0)) {
            if (match[0] !== undefined) {
                this.pushToken(TwingTokenType.STRING, match[0]);
                this.moveCursor(match[0]);
            }
        } else {
            let content = this.brackets.pop().value;

            this.pushToken(TwingTokenType.CLOSING_QUOTE, content);
            this.moveCursor(content);
            this.popState();
        }
    }

    private lexInterpolation() {
        let match: RegExpExecArray;
        let bracket = this.brackets[this.brackets.length - 1];

        if (this.options.interpolation[0] === bracket.value && (match = this.regexes.interpolation_end.exec(this.code.substring(this.cursor))) !== null) {
            let tag = match[2];
            let whitespace = match[1] || '';

            this.brackets.pop();

            this.pushToken(TwingTokenType.WHITESPACE, whitespace);
            this.pushToken(TwingTokenType.INTERPOLATION_END, tag);
            this.moveCursor(tag + whitespace);
            this.popState();
        } else {
            this.lexExpression();
        }
    }

    private moveCursor(text: string) {
        this.cursor += text.length;
    }

    private moveCoordinates(text: string) {
        this.columnno += text.length;

        let lines = text.split(/\r\n|\r|\n/);

        let lineCount = lines.length - 1;

        if (lineCount > 0) {
            this.lineno += lineCount;
            this.columnno = 1 + lines[lineCount].length;
        }
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
            if (new RegExp('[A-Za-z]').test(operator[length - 1])) {
                pattern = preg_quote(operator, '/') + '(?=[\\s()])';
            } else {
                pattern = preg_quote(operator, '/');
            }

            // an operator with a space can be any amount of whitespaces
            pattern = pattern.replace(/\s+/, '\\s+');

            patterns.push('^' + pattern);
        });

        return new RegExp(patterns.join('|'));
    };

    private pushToken(type: TwingTokenType, content: any) {
        if ((type === TwingTokenType.TEXT || type === TwingTokenType.WHITESPACE) && (content.length < 1)) {
            return;
        }

        this.tokens.push(new TwingToken(type, content, this.lineno, this.columnno));

        if (content) {
            this.moveCoordinates(content);
        }
    }

    private pushWhitespaceTrimToken(modifier: string) {
        if (modifier) {
            let type: TwingTokenType;

            if (modifier === this.options.whitespace_trim) {
                type = TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING;
            } /** else {
                type = TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING;
            } **/

            this.tokens.push(new TwingToken(type, modifier, this.lineno, this.columnno));
            this.moveCoordinates(modifier);
        }
    }

    private pushState(state: number) {
        this.states.push(this.state);
        this.state = state;
    }

    /**
     * @return TwingLexerState
     */
    private popState() {
        this.state = this.states.pop();
    }
}
