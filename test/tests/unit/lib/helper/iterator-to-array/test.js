const {iteratorToArray} = require('../../../../../../dist');

const tap = require('tape');

class TestIterator {
    constructor() {
    }

    next() {
    }
}

class Foo {

}

tap.test('iterator-to-array', function (test) {
    test.same(iteratorToArray(new TestIterator()), []);
    test.same(iteratorToArray({foo: 'bar'}), ['bar']);

    let foo = new Foo();

    test.same(iteratorToArray(foo), foo);

    test.end();
});
