export default class {
    private array: any[];
    private position: number;

    constructor() {
        this.array = null;
        this.position = 0;
    }

    * [Symbol.iterator]() {
        yield 1;
        yield 2;
    }

    bar(param1: string = null, param2: string = null) {
        return 'bar' + (param1 ? '_' + param1 : '') + (param2 ? '-' + param2 : '');
    }

    getFoo() {
        return 'foo';
    }

    getSelf() {
        return this;
    }

    is() {
        return 'is';
    }

    in() {
        return 'in';
    }

    not() {
        return 'not';
    }
}

export const BAR_NAME = 'bar';

