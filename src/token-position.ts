class TokenPosition {
    line: number = 0;
    column: number = 0;
    source: string = null;

    /**
     *
     * @param {number} line
     * @param {number} column
     * @param {string} source
     */
    constructor(line: number = 0, column: number = 0, source:string = null) {
        this.line = line;
        this.column = column;
        this.source = source;
    }
}

export default TokenPosition;