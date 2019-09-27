const {source} = require('../../../../../../../../dist/cjs/lib/extension/core/functions/source');
const tape = require('tape');
const sinon = require('sinon');

const {
    TwingEnvironment,
    TwingLoaderArray,
    TwingSource
} = require('../../../../../../../../dist/cjs/main');

tape.test('source', function (test) {
    let loader = new TwingLoaderArray({});
    let env = new TwingEnvironment(loader);

    try {
        source(env, new TwingSource('', 'index'), 'foo', false);
    }
    catch (e) {
        test.same(e.name, 'TwingErrorLoader');
        test.same(e.message, 'Template "foo" is not defined in "index".');
    }

    test.equals(source(env, new TwingSource('', 'index'), 'foo', true), null);

    sinon.stub(loader, 'getSourceContext').throws(new Error('foo'));

    try {
        source(env, new TwingSource('', 'index'), 'foo', false);
    }
    catch (e) {
        test.same(e.name, 'Error');
        test.same(e.message, 'foo');
    }

    test.end();
});