export class TwingSource {
    private readonly code: string;
    private readonly name: string;
    private readonly resolvedName: string;

    constructor(code: string, name: string, resolvedName?: string) {
        this.code = code;
        this.name = name;
        this.resolvedName = resolvedName || name;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    getResolvedName() {
        return this.resolvedName;
    }
}
