class TwingTestToStringStub {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

export default TwingTestToStringStub;