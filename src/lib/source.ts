export class TwingSource {
    private readonly code: string;
    private readonly name: string;
    private readonly path: string;

    constructor(code: string, name: string, path: string = '') {
        this.code = code;
        this.name = name as string;
        this.path = path;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    getPath() {
        return this.path;
    }
}
