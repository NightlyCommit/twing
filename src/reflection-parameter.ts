export class TwingReflectionParameter {
    private name: string;
    private defaultValue: any;
    private optional: boolean = false;

    constructor(name: string, defaultValue: any) {
        this.name = name;
        this.defaultValue = defaultValue;
    }

    isDefaultValueAvailable(): boolean {
        return (this.defaultValue !== undefined);
    }

    getName(): string {
        return this.name;
    }

    getDefaultValue(): any {
        return this.defaultValue;
    }

    isArray(): boolean {
        // type hinting, used by PHP to support that function, does not exist in JavaScript
        // if we have a default value, we test its type against Array
        // else we return true since any parameter can potentially be an array
        if (this.isDefaultValueAvailable()) {
            return Array.isArray(this.getDefaultValue());
        }

        return true;
    }

    isOptional(): boolean {
        return this.optional;
    }

    setOptional(flag: boolean) {
        this.optional = flag;
    }
}
