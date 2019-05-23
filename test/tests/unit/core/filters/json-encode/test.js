const {twingFilterJsonEncode} = require('../../../../../../build/core/filters/json-encode');

const tap = require('tape');

tap.test('json-encode', function (test) {
    test.test('supports Map instances', function (test) {
        test.same(twingFilterJsonEncode(new Map([['a', 1], ['b', '2']])), '{"a":1,"b":"2"}');

        test.end();
    });

    test.test('supports Array instances', function (test) {
        test.same(twingFilterJsonEncode([1, '2']), '[1,"2"]');

        test.end();
    });

    test.test('supports Object instances', function (test) {
        test.same(twingFilterJsonEncode({a: 1, b: "2"}), '{"a":1,"b":"2"}');

        test.end();
    });

    test.test('supports strings', function (test) {
        test.same(twingFilterJsonEncode('foo'), '"foo"');
        test.same(twingFilterJsonEncode(String('foo')), '"foo"');

        test.end();
    });

    test.end();
});