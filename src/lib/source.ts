export class TwingSource {
    private readonly code: string;
    private readonly name: string;

    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }
}
