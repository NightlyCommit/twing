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
    test.test('support parameters with default value', async function (test) {
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

    test.test('support mixed kind of parameters', async function (test) {
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

    test.test('support instrumented parameters', async function (test) {
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

    test.end();
});
