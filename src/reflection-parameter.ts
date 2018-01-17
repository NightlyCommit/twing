class TwingReflectionParameter {
    private name: string;
    private defaultValue: any;

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
        return false;
    }

    isOptional(): boolean {
        return false;
    }
}

export default TwingReflectionParameter;