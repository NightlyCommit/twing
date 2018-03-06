export class TwingToken {
    private value: string;
    private type: string;
    private lineno: number;

    static EOF_TYPE = 'EOF_TYPE';
    static TEXT_TYPE = 'TEXT_TYPE';
    static BLOCK_START_TYPE = 'BLOCK_START_TYPE';
    static VAR_START_TYPE = 'VAR_START_TYPE';
    static BLOCK_END_TYPE = 'BLOCK_END_TYPE';
    static VAR_END_TYPE = 'VAR_END_TYPE';
    static NAME_TYPE = 'NAME_TYPE';
    static NUMBER_TYPE = 'NUMBER_TYPE';
    static STRING_TYPE = 'STRING_TYPE';
    static OPERATOR_TYPE = 'OPERATOR_TYPE';
    static PUNCTUATION_TYPE = 'PUNCTUATION_TYPE';
    static INTERPOLATION_START_TYPE = 'INTERPOLATION_START_TYPE';
    static INTERPOLATION_END_TYPE = 'INTERPOLATION_END_TYPE';

    constructor(type: string, value: string, lineno: number) {
        this.type = type;
        this.value = value;
        this.lineno = lineno;
    }

    /**
     * Tests the current token for a type and/or a value.
     *
     * Parameters may be:
     *  * just type
     *  * type and value (or array of possible values)
     *  * just value (or array of possible values) (NAME_TYPE is used as type)
     *
     * @param type TwingTokenType
     * @param values string|Array<string>
     * @returns {boolean}
     */
    public test(type: string, values: Array<string> | string | number = null) {
        return (this.type === type) && (
            values === null ||
            (Array.isArray(values) && values.includes(this.value)) ||
            this.value == values
        );
    }

    /**
     * @return int
     */
    public getLine() {
        return this.lineno;
    }

    public getType() {
        return this.type;
    }

    public getValue() {
        return this.value;
    }

    toString() {
        return `${TwingToken.typeToEnglish(this.type)}(${this.value})`;
    }

    static typeToEnglish(type: string): string {
        switch (type) {
            case TwingToken.EOF_TYPE:
                return 'end of template';
            case TwingToken.TEXT_TYPE:
                return 'text';
            case TwingToken.BLOCK_START_TYPE:
                return 'begin of statement block';
            case TwingToken.VAR_START_TYPE:
                return 'begin of print statement';
            case TwingToken.BLOCK_END_TYPE:
                return 'end of statement block';
            case TwingToken.VAR_END_TYPE:
                return 'end of print statement';
            case TwingToken.NAME_TYPE:
                return 'name';
            case TwingToken.NUMBER_TYPE:
                return 'number';
            case TwingToken.STRING_TYPE:
                return 'string';
            case TwingToken.OPERATOR_TYPE:
                return 'operator';
            case TwingToken.PUNCTUATION_TYPE:
                return 'punctuation';
            case TwingToken.INTERPOLATION_START_TYPE:
                return 'begin of string interpolation';
            case TwingToken.INTERPOLATION_END_TYPE:
                return 'end of string interpolation';
            default:
                throw new Error(`Token of type "${type}" does not exist.`);
        }
    }
}
