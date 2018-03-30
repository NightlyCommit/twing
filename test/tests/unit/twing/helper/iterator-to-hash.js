const iteratorToHash = require('../../../../../lib/twing/helper/iterator-to-hash').iteratorToHash;

const tap = require('tap');

class Foo {

}

tap.test('iterator-to-array', function (test) {
    let obj = {foo: 'bar'};

    test.equals(iteratorToHash(obj), obj);

    let foo = new Foo();

    test.equals(iteratorToHash(foo), foo);

    test.end();
});
