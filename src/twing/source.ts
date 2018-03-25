export class TwingSource {
    private code: string;
    private name: string;
    private path: string;

    constructor(code: string, name: string | Object, path: string = '') {
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
