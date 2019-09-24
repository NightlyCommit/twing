const {include} = require('../../../../../../../../build/lib/extension/core/functions/include');
const tape = require('tape');
const path = require('path');

const {
    TwingEnvironment,
    TwingLoaderRelativeFilesystem,
    TwingLoaderArray,
    TwingSource
} = require('../../../../../../../../build/main');

tape.test('include', function (test) {
    let env = new TwingEnvironment(new TwingLoaderArray({}));

    try {
        include(env, new Map(), null, 'foo', {}, true, false, true);

        test.fail();
    }
    catch (e) {
        test.same(e.name, 'TwingErrorLoader');
        test.same(e.message, 'Template "foo" is not defined.');
    }

    env = new TwingEnvironment(new TwingLoaderArray({foo: 'bar'}));
    env.enableSandbox();

    test.same(include(env, new Map(), null, 'foo', {}, true, false, true), 'bar');

    test.test('supports being called with a source', function (test) {
        env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());

        test.same(include(env, new Map(), new TwingSource('code', 'name', path.resolve('test/tests/unit/lib/extension/core/index.twig')), 'templates/foo.twig'), 'foo');

        test.end();
    });

    test.end();
});