import * as tape from 'tape';
import {examineObject} from "../../../../../../src/lib/helpers/examine-object";

class Foo {
    foo: string;

    constructor() {
        this.foo = 'foo';
    }

    fooMethod() {
        return this.foo;
    }
}

class Bar extends Foo {
    bar: string;

    constructor() {
        super();

        this.bar = 'bar';
    }

    barMethod() {
        return this.bar;
    }
}

class FooBar extends Bar {
    fooBar: string;

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

tape('examine-object', (test) => {
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