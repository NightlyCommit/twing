import * as tape from 'tape';
import {jsonEncode} from "../../../../../../../../src/lib/extension/core/filters/json-encode";

const pureMap = new Map<any, any>([[0, 1], [1, 2]]); // [1,2]
const keyedMap = new Map<any, any>([["a", 1], [1, 2]]); // {"1":2,"a":1}

tape('json-encode', (test) => {
    test.test('supports Map instances', async (test) => {
        test.same(await jsonEncode(new Map<any, any>([['a', 1], ['b', 2]])), '{"a":1,"b":2}');
        test.same(await jsonEncode(new Map<any, any>([[0, 1], [1, 2]])), '[1,2]');
        test.same(await jsonEncode(new Map<any, any>([[0, true], [1, false]])), '[true,false]');
        test.same(await jsonEncode(new Map<any, any>([[0, pureMap], [1, false]])), '[[1,2],false]');
        test.same(await jsonEncode(new Map<any, any>([[0, keyedMap], [1, false]])), '[{"1":2,"a":1},false]');

        test.end();
    });

    test.test('supports Array instances', async (test) => {
        test.same(await jsonEncode([1, '2']), '[1,"2"]');
        test.same(await jsonEncode([pureMap, '2']), '[[1,2],"2"]');
        test.same(await jsonEncode([keyedMap, '2']), '[{"1":2,"a":1},"2"]');

        test.end();
    });

    test.test('supports Object instances', async (test) => {
        test.same(await jsonEncode({a: 1, b: "2"}), '{"a":1,"b":"2"}');
        test.same(await jsonEncode({a: pureMap, b: "2"}), '{"a":[1,2],"b":"2"}');
        test.same(await jsonEncode({a: keyedMap, b: "2"}), '{"a":{"1":2,"a":1},"b":"2"}');
        test.same(await jsonEncode({0: 1, 1: "2"}), '[1,"2"]');
        test.same(await jsonEncode({"0": pureMap, 1: "2"}), '[[1,2],"2"]');
        test.same(await jsonEncode({"0": keyedMap, 1: "2"}), '[{"1":2,"a":1},"2"]');

        test.end();
    });

    test.test('supports strings', async (test) => {
        test.same(await jsonEncode('foo'), '"foo"');
        test.same(await jsonEncode(String('foo')), '"foo"');

        test.end();
    });

    test.end();
});
