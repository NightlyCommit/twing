module.exports = class TwingTestFoo {
    constructor() {
        this.position = 0;
        this.array = null;

        this[Symbol.iterator] = function* () {
            yield 1;
            yield 2;
        };
    }

    bar(param1 = null, param2 = null) {
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
};

module.exports.BAR_NAME = 'bar';

