class TwingTestFoo {
    static BAR_NAME = 'bar';
    
    public position: number = 0;
    public array: Map<any, any>;

    [Symbol.iterator] = function* () {
        yield 1;
        yield 2;
    };

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

export default TwingTestFoo;