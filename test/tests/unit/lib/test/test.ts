import * as tape from 'tape';
import {TwingTest} from "../../../../../src/lib/test";

tape('test', (test) => {
    test.test('getNodeFactory', function(test) {
        let factory = () => {};

        let twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            expression_factory: factory
        });

        test.same(twingTest.getExpressionFactory(), factory);

        test.end();
    });

    test.test('isVariadic', function(test) {
        let twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            is_variadic: true
        });

        test.same(twingTest.isVariadic(), true);

        test.end();
    });

    test.test('isDeprecated', function(test) {
        let twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            deprecated: '1'
        });

        test.same(twingTest.isDeprecated(), true);

        twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            deprecated: null
        });

        test.same(twingTest.isDeprecated(), false);

        test.end();
    });

    test.test('getDeprecatedVersion', function(test) {
        let twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            deprecated: '1'
        });

        test.same(twingTest.getDeprecatedVersion(), '1');

        test.end();
    });

    test.test('getAlternative', function(test) {
        let twingTest = new TwingTest('foo', () => Promise.resolve(true), [], {
            alternative: 'bar'
        });

        test.same(twingTest.getAlternative(), 'bar');

        test.end();
    });

    test.end();
});
