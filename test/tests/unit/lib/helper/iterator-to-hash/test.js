const {iteratorToHash} = require('../../../../../../build');

const tap = require('tape');

class Foo {

}

tap.test('iterator-to-array', function (test) {
    let obj = {foo: 'bar'};

    test.equals(iteratorToHash(obj), obj);

    let foo = new Foo();

    test.equals(iteratorToHash(foo), foo);

    test.end();
});
