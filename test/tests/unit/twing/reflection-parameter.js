const TwingReflectionParameter = require('../../../../lib/twing/reflection-parameter').TwingReflectionParameter;

const tap = require('tap');

tap.test('reflection-parameter', function (test) {
    test.test('isOptional', function (test) {
        let reflectionParameter = new TwingReflectionParameter('foo', 'bar');

        reflectionParameter.setOptional(true);

        test.true(reflectionParameter.isOptional());

        test.end();
    });

    test.end();
});
