const iteratorToArray = require('../../../../../lib/twing/helper/iterator-to-array').iteratorToArray;

const tap = require('tap');

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
