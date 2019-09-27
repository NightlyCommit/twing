const {include} = require('../../../../../../../../dist/cjs/lib/extension/core/functions/include');
const tape = require('tape');
const path = require('path');

const {
    TwingEnvironment,
    TwingLoaderRelativeFilesystem,
    TwingLoaderArray,
    TwingSource
} = require('../../../../../../../../dist/cjs/main');

tape.test('include', function (test) {
    let env = new TwingEnvironment(new TwingLoaderArray({}));

    try {
        include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', {}, true, false, true);

        test.fail();
    }
    catch (e) {
        test.same(e.name, 'TwingErrorLoader');
        test.same(e.message, 'Template "foo" is not defined in "index.twig".');
    }

    try {
        include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', 'bar', true, false, true);

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'Variables passed to the "include" function or tag must be iterable, got "string" in "index.twig".');
    }

    env = new TwingEnvironment(new TwingLoaderArray({foo: 'bar'}));
    env.enableSandbox();

    test.same(include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', {}, true, false, true), 'bar');

    test.test('supports being called with a source', function (test) {
        env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());

        test.same(include(env, new Map(), new TwingSource('code', 'name', path.resolve('test/tests/unit/lib/extension/core/index.twig')), 'templates/foo.twig', {}), 'foo');

        test.end();
    });

    test.end();
});