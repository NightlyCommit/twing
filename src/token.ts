export enum TwingTokenType {
    EOF = 'EOF',
    TEXT = 'TEXT',
    BLOCK_START = 'BLOCK_START',
    BLOCK_END = 'BLOCK_END',
    VAR_START = 'VAR_START',
    VAR_END = 'VAR_END',
    NAME = 'NAME',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    OPERATOR = 'OPERATOR',
    PUNCTUATION = 'PUNCTUATION',
    INTERPOLATION_START = 'INTERPOLATION_START',
    INTERPOLATION_END = 'INTERPOLATION_END',
    COMMENT_START = 'COMMENT_START',
    COMMENT_END = 'COMMENT_END',
    WHITESPACE = 'WHITESPACE',
    OPENING_QUOTE = 'OPENING_QUOTE',
    CLOSING_QUOTE = 'CLOSING_QUOTE',
    WHITESPACE_CONTROL_MODIFIER_TRIMMING = 'WHITESPACE_CONTROL_MODIFIER_TRIMMING',
    WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING = 'WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING'
}

export class TwingToken {
    readonly type: TwingTokenType;
    readonly tag: string;
    readonly content: string;
    readonly lineno: number;
    readonly columnno: number;

    constructor(type: TwingTokenType, content: string, lineno: number, columnno: number) {
        this.type = type;
        this.content = content;
        this.lineno = lineno;
        this.columnno = columnno;
    }

    /**
     * Returns the constant representation (internal) of a given type.
     *
     * @param {TwingTokenType} type The type
     * @param {boolean} short Whether to return a short representation or not
     *
     * @returns {string} The string representation
     */
    static typeToString(type: TwingTokenType, short: boolean = false) {
        if (TwingTokenType[type]) {
            return short ? type : 'TwingTokenType.' + type;
        }
        else {
            throw new Error(`Token of type "${type}" does not exist.`);
        }
    }

    /**
     * Returns the English representation of a given type.
     *
     * @param {int} type The type as an integer
     *
     * @returns {string} The string representation
     */
    static typeToEnglish(type: string): string {
        switch (type) {
            case TwingTokenType.EOF:
                return 'end of template';
            case TwingTokenType.TEXT:
                return 'text';
            case TwingTokenType.BLOCK_START:
                return 'begin of statement block';
            case TwingTokenType.VAR_START:
                return 'begin of print statement';
            case TwingTokenType.BLOCK_END:
                return 'end of statement block';
            case TwingTokenType.VAR_END:
                return 'end of print statement';
            case TwingTokenType.NAME:
                return 'name';
            case TwingTokenType.NUMBER:
                return 'number';
            case TwingTokenType.STRING:
                return 'string';
            case TwingTokenType.OPERATOR:
                return 'operator';
            case TwingTokenType.PUNCTUATION:
                return 'punctuation';
            case TwingTokenType.INTERPOLATION_START:
                return 'begin of string interpolation';
            case TwingTokenType.INTERPOLATION_END:
                return 'end of string interpolation';
            case TwingTokenType.COMMENT_START:
                return 'begin of comment statement';
            case TwingTokenType.COMMENT_END:
                return 'end of comment statement';
            case TwingTokenType.WHITESPACE:
                return 'whitespace';
            case TwingTokenType.OPENING_QUOTE:
                return 'opening quote';
            case TwingTokenType.CLOSING_QUOTE:
                return 'closing quote';
            case TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING:
                return 'trimming whitespace control modifier';
            case TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING:
                return 'line trimming whitespace control modifier';
            default:
                throw new Error(`Token of type "${type}" does not exist.`);
        }
    }

    /**
     * Tests the current token for a type and/or a content.
     *
     * @param {TwingTokenType} type
     * @param {string|Array<string>} contents
     * @returns {boolean}
     */
    public test(type: TwingTokenType, contents: Array<string> | string | number = null) {
        return (this.type === type) && (contents === null || (Array.isArray(contents) && contents.includes(this.content)) || this.content == contents);
    }

    /**
     * @return int
     */
    public getLine() {
        return this.lineno;
    }

    /**
     * @return int
     */
    public getColumn() {
        return this.columnno;
    }

    public getType(): TwingTokenType {
        return this.type;
    }

    public getContent() {
        return this.content;
    }

    toString() {
        return `${TwingToken.typeToString(this.type, true)}(${this.content ? this.content : ''})`;
    }

    /**
     * Serialize the token to a Twig string
     *
     * @return string
     */
    serialize() {
        return this.content;
    }
}
