import * as tape from 'tape';
import {jsonEncode} from "../../../../../../../../src/lib/extension/core/filters/json-encode";

tape('json-encode', (test) => {
    test.test('supports Map instances', async (test) => {
        test.same(await jsonEncode(new Map([['a', 1], ['b', 2]])), '{"a":1,"b":2}');
        test.same(await jsonEncode(new Map([[0, 1], [1, 2]])), '[1,2]');

        test.end();
    });

    test.test('supports Array instances', async (test) => {
        test.same(await jsonEncode([1, '2']), '[1,"2"]');

        test.end();
    });

    test.test('supports Object instances', async (test) => {
        test.same(await jsonEncode({a: 1, b: "2"}), '{"a":1,"b":"2"}');
        test.same(await jsonEncode({0: 1, 1: "2"}), '{"0":1,"1":"2"}');
        test.same(await jsonEncode({"0": 1, 1: "2"}), '{"0":1,"1":"2"}');

        test.end();
    });

    test.test('supports strings', async (test) => {
        test.same(await jsonEncode('foo'), '"foo"');
        test.same(await jsonEncode(String('foo')), '"foo"');

        test.end();
    });

    test.end();
});
