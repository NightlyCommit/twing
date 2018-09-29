const {TwingTest} = require("../../../../../build/index");

const tap = require('tape');

tap.test('test', function (test) {
    test.test('getNodeFactory', function(test) {
        let factory = () => {};

        let twingTest = new TwingTest('foo', () => {}, {
            node_factory: factory
        });

        test.same(twingTest.getNodeFactory(), factory);

        test.end();
    });

    test.test('isVariadic', function(test) {
        let twingTest = new TwingTest('foo', () => {}, {
            is_variadic: true
        });

        test.same(twingTest.isVariadic(), true);

        test.end();
    });

    test.test('isDeprecated', function(test) {
        let twingTest = new TwingTest('foo', () => {}, {
            deprecated: true
        });

        test.same(twingTest.isDeprecated(), true);

        twingTest = new TwingTest('foo', () => {}, {
            deprecated: false
        });

        test.same(twingTest.isDeprecated(), false);

        test.end();
    });

    test.test('getDeprecatedVersion', function(test) {
        let twingTest = new TwingTest('foo', () => {}, {
            deprecated: 1
        });

        test.same(twingTest.getDeprecatedVersion(), 1);

        test.end();
    });

    test.test('getAlternative', function(test) {
        let twingTest = new TwingTest('foo', () => {}, {
            alternative: 'bar'
        });

        test.same(twingTest.getAlternative(), 'bar');

        test.end();
    });

    test.end();
});