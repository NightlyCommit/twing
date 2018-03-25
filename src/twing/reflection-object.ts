export type TwingReflectionObjectDefinition = {
    fileName: string
}

export class TwingReflectionObject {
    protected static container: Map<any, TwingReflectionObjectDefinition> = new Map();
    protected object: any;
    protected fileName: string;

    constructor(object: any) {
        this.object = object;

        this.fileName = TwingReflectionObject.container.get(this.object).fileName;
    }

    public static register(object: any, definition: TwingReflectionObjectDefinition) {
        TwingReflectionObject.container.set(object, definition);
    }

    getFileName(): string {
        return this.fileName;
    }
}
