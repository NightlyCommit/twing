const {examineObject} = require('../../../../../../build');

const tap = require('tape');

class Foo {
    constructor() {
        this.foo = 'foo';
    }

    fooMethod() {
        return this.foo;
    }
}

class Bar extends Foo {
    constructor() {
        super();

        this.bar = 'bar';
    }

    barMethod() {
        return this.bar;
    }
}

class FooBar extends Bar {
    constructor() {
        super();

        this.fooBar = 'fooBar';
    }

    fooBarMethod() {
        return this.fooBar;
    }

    oofMethod() {
        return 'oof';
    }
}

tap.test('examine-object', function (test) {
    let object = new FooBar();

    let properties = examineObject(object);

    let expected = [
        'bar',
        'barMethod',
        'foo',
        'fooBar',
        'fooBarMethod',
        'fooMethod',
        'oofMethod'
    ];
    let actual = properties.filter(function(item) {
        return expected.includes(item);
    });

    actual.sort();

    test.same(actual, expected, 'should return object properties by climbing up the prototype chain');

    test.end();
});