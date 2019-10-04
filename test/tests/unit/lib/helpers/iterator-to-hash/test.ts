import * as tape from 'tape';
import {iteratorToHash} from "../../../../../../src/lib/helpers/iterator-to-hash";

class Foo {

}

tape('iterator-to-array', (test) => {
    let obj = {foo: 'bar'};

    test.equals(iteratorToHash(obj), obj);

    let foo = new Foo();

    test.equals(iteratorToHash(foo), foo);

    test.end();
});
