export class TwingToken {
    static EOF_TYPE = -1;
    static TEXT_TYPE = 0;
    static BLOCK_START_TYPE = 1;
    static VAR_START_TYPE = 2;
    static BLOCK_END_TYPE = 3;
    static VAR_END_TYPE = 4;
    static NAME_TYPE = 5;
    static NUMBER_TYPE = 6;
    static STRING_TYPE = 7;
    static OPERATOR_TYPE = 8;
    static PUNCTUATION_TYPE = 9;
    static INTERPOLATION_START_TYPE = 10;
    static INTERPOLATION_END_TYPE = 11;
    private value: string;
    private type: number;
    private lineno: number;

    constructor(type: number, value: string, lineno: number) {
        this.type = type;
        this.value = value;
        this.lineno = lineno;
    }

    /**
     * Returns the constant representation (internal) of a given type.
     *
     * @param {int} type The type as an integer
     * @param {boolean} short Whether to return a short representation or not
     *
     * @returns {string} The string representation
     */
    static typeToString(type: number, short: boolean = false) {
        let name: string;

        switch (type) {
            case TwingToken.EOF_TYPE:
                name = 'EOF_TYPE';
                break;
            case TwingToken.TEXT_TYPE:
                name = 'TEXT_TYPE';
                break;
            case TwingToken.BLOCK_START_TYPE:
                name = 'BLOCK_START_TYPE';
                break;
            case TwingToken.VAR_START_TYPE:
                name = 'VAR_START_TYPE';
                break;
            case TwingToken.BLOCK_END_TYPE:
                name = 'BLOCK_END_TYPE';
                break;
            case TwingToken.VAR_END_TYPE:
                name = 'VAR_END_TYPE';
                break;
            case TwingToken.NAME_TYPE:
                name = 'NAME_TYPE';
                break;
            case TwingToken.NUMBER_TYPE:
                name = 'NUMBER_TYPE';
                break;
            case TwingToken.STRING_TYPE:
                name = 'STRING_TYPE';
                break;
            case TwingToken.OPERATOR_TYPE:
                name = 'OPERATOR_TYPE';
                break;
            case TwingToken.PUNCTUATION_TYPE:
                name = 'PUNCTUATION_TYPE';
                break;
            case TwingToken.INTERPOLATION_START_TYPE:
                name = 'INTERPOLATION_START_TYPE';
                break;
            case TwingToken.INTERPOLATION_END_TYPE:
                name = 'INTERPOLATION_END_TYPE';
                break;
            default:
                throw new Error(`Token of type "${type}" does not exist.`);
        }

        return short ? name : 'TwingToken.' + name;
    }

    /**
     * Returns the English representation of a given type.
     *
     * @param {int} type The type as an integer
     *
     * @returns {string} The string representation
     */
    static typeToEnglish(type: number): string {
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

    /**
     * Tests the current token for a type and/or a value.
     *
     * Parameters may be:
     *  * just type
     *  * type and value (or array of possible values)
     *  * just value (or array of possible values) (NAME_TYPE is used as type)
     *
     * @param {number} type
     * @param {string|Array<string>} values
     * @returns {boolean}
     */
    public test(type: number, values: Array<string> | string | number = null) {
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
        return `${TwingToken.typeToString(this.type, true)}(${this.value ? this.value : ''})`;
    }
}
