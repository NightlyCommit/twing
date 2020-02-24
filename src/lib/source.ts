export class TwingSource {
    private readonly code: string;
    private readonly name: string;
    private readonly fqn: string;

    constructor(code: string, name: string, fqn?: string) {
        this.code = code;
        this.name = name;
        this.fqn = fqn || name;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    getFQN() {
        return this.fqn;
    }
}
