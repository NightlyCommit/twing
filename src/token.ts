import Position from "./token-position";
import TwingTokenType from "./token-type";

class TwingToken {
    position: Position;
    type: TwingTokenType;
    value: string;
    lineno: number;

    constructor(type: TwingTokenType, value: string, lineno: number) {
        this.position = new Position;
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
    public test(type: TwingTokenType, values: Array<string> | string | number = null) {
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

    static typeToEnglish(type: TwingTokenType): string {
        switch (type) {
            case TwingTokenType.EOF_TYPE:
                return 'end of template';
            case TwingTokenType.TEXT_TYPE:
                return 'text';
            case TwingTokenType.BLOCK_START_TYPE:
                return 'begin of statement block';
            case TwingTokenType.VAR_START_TYPE:
                return 'begin of print statement';
            case TwingTokenType.BLOCK_END_TYPE:
                return 'end of statement block';
            case TwingTokenType.VAR_END_TYPE:
                return 'end of print statement';
            case TwingTokenType.NAME_TYPE:
                return 'name';
            case TwingTokenType.NUMBER_TYPE:
                return 'number';
            case TwingTokenType.STRING_TYPE:
                return 'string';
            case TwingTokenType.OPERATOR_TYPE:
                return 'operator';
            case TwingTokenType.PUNCTUATION_TYPE:
                return 'punctuation';
            case TwingTokenType.INTERPOLATION_START_TYPE:
                return 'begin of string interpolation';
            case TwingTokenType.INTERPOLATION_END_TYPE:
                return 'end of string interpolation';
            default:
                throw new Error(`Token of type "${type}" does not exist.`);
        }
    }
}

export default TwingToken;