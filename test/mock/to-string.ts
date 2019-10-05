export class ToStringMock {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}
