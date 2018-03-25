const TwingReflectionMethod = require('../../../../lib/twing/reflection-method').TwingReflectionMethod;

const tap = require('tap');

function withDefaultValues(arg1 = null, arg2 = true) {
}

function withMixedKindOfParameters(arg1, arg2 = true, arg3 = 'foo') {
}

let c = 0;

function withInstrumentedParameters(arg1, arg2 = (c++, true), arg3 = (c++, 'foo')) {
}

tap.test('reflection-method', function (test) {
    test.test('support parameters with default value', function (test) {
        let reflectionMethod = new TwingReflectionMethod(withDefaultValues, 'foo');

        let parameters = reflectionMethod.getParameters();

        test.same(parameters, [
            {
                name: 'arg1',
                defaultValue: null,
                optional: true
            },
            {
                name: 'arg2',
                defaultValue: true,
                optional: true
            }
        ]);

        test.end();
    });

    test.test('support mixed kind of parameters', function (test) {
        let reflectionMethod = new TwingReflectionMethod(withMixedKindOfParameters, 'foo');

        let parameters = reflectionMethod.getParameters();

        test.same(parameters, [
            {
                name: 'arg1',
                defaultValue: undefined,
                optional: false
            },
            {
                name: 'arg2',
                defaultValue: true,
                optional: true
            },
            {
                name: 'arg3',
                defaultValue: 'foo',
                optional: true
            }
        ]);

        test.end();
    });

    test.test('support instrumented parameters', function (test) {
        let reflectionMethod = new TwingReflectionMethod(withInstrumentedParameters, 'foo');

        let parameters = reflectionMethod.getParameters();

        test.same(parameters, [
            {
                name: 'arg1',
                defaultValue: undefined,
                optional: false
            },
            {
                name: 'arg2',
                defaultValue: true,
                optional: true
            },
            {
                name: 'arg3',
                defaultValue: 'foo',
                optional: true
            }
        ]);

        test.end();
    });

    test.test('supports global function', function(test) {
        let reflectionMethod = new TwingReflectionMethod('clearInterval', 'foo');

        test.same(reflectionMethod.getParameters()[0].name, 'timer');

        test.end();
    });

    test.test('handle unparsable method', function(test) {
        test.throws(function() {
            new TwingReflectionMethod(Math.abs, 'foo');
        }, new Error('Method "function abs() { [native code] }" is not parsable (SyntaxError: Unexpected token, expected "," (1:25)).'));

        test.end();
    });

    test.end();
});
