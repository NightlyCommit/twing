import * as tape from 'tape';
import {iteratorToArray} from "../../../../../../src/lib/helpers/iterator-to-array";

class TestIterator {
    values: any[];
    position: number;

    constructor(values: any[] = []) {
        this.values = values;
        this.position = 0;
    }

    next() {
        return this.position < this.values.length ? {
            done: false,
            value: this.values[this.position++]
        } : {
            done: true
        };
    }
}

class Foo {

}

tape('iterator-to-array', (test) => {
    test.same(iteratorToArray(new TestIterator()), []);
    test.same(iteratorToArray(new TestIterator([1, 2])), [1, 2]);
    test.same(iteratorToArray({foo: 'bar'}), ['bar']);

    let foo = new Foo();

    test.same(iteratorToArray(foo), []);

    test.end();
});
