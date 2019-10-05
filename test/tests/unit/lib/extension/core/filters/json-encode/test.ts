import * as tape from 'tape';
import {jsonEncode} from "../../../../../../../../src/lib/extension/core/filters/json-encode";

tape('json-encode', (test) => {
    test.test('supports Map instances', (test) => {
        test.same(jsonEncode(new Map([['a', 1], ['b', 2]])), '{"a":1,"b":2}');
        test.same(jsonEncode(new Map([[0, 1], [1, 2]])), '[1,2]');

        test.end();
    });

    test.test('supports Array instances', (test) => {
        test.same(jsonEncode([1, '2']), '[1,"2"]');

        test.end();
    });

    test.test('supports Object instances', (test) => {
        test.same(jsonEncode({a: 1, b: "2"}), '{"a":1,"b":"2"}');
        test.same(jsonEncode({0: 1, 1: "2"}), '{"0":1,"1":"2"}');
        test.same(jsonEncode({"0": 1, 1: "2"}), '{"0":1,"1":"2"}');

        test.end();
    });

    test.test('supports strings', (test) => {
        test.same(jsonEncode('foo'), '"foo"');
        test.same(jsonEncode(String('foo')), '"foo"');

        test.end();
    });

    test.end();
});