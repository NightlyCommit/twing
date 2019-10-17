import * as tape from 'tape';
import {chunk} from "../../../../../../src/lib/helpers/chunk";

tape('chunk', (test) => {
    test.test('supports arrays', async (test) => {
        test.same(await chunk(new Map([['foo', 'bar'], ['bar', 'foo']]), 1), [new Map([[0, 'bar']]), new Map([[0, 'foo']])]);
        test.same(await chunk(new Map([['foo', 'bar'], ['bar', 'foo']]), 1, true), [new Map([['foo', 'bar']]), new Map([['bar', 'foo']])]);

        test.end();
    });

    test.end();
});
