export type TwingReflectionObjectDefinition = {
    fileName: string
}

export class TwingReflectionObject {
    protected object: any;
    protected fileName: string;

    protected static container: Map<any, TwingReflectionObjectDefinition> = new Map();

    constructor(object: any) {
        this.object = object;

        if (TwingReflectionObject.container.has(this.object)) {
            this.fileName = TwingReflectionObject.container.get(this.object).fileName;
        }
    }

    getFileName(): string {
        return this.fileName;
    }

    public static register(object: any, definition: TwingReflectionObjectDefinition) {
        TwingReflectionObject.container.set(object, definition);
    }
}
