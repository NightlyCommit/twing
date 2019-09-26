const {TwingLoaderNull} = require('../../../../../../dist/cjs/lib/loader/null');

const tap = require('tape');

tap.test('loader array', function (test) {
    test.test('getSourceContext', function (test) {
        let loader = new TwingLoaderNull();

        test.same(loader.getSourceContext('foo', null), null);

        test.end();
    });

    test.test('exists', function (test) {
        let loader = new TwingLoaderNull();

        test.same(loader.exists('foo', null), false);

        test.end();
    });

    test.test('getCacheKey', function (test) {
        let loader = new TwingLoaderNull();

        test.same(loader.getCacheKey('foo', null), null);

        test.end();
    });

    test.test('isFresh', function (test) {
        let loader = new TwingLoaderNull();

        test.true(loader.isFresh('foo', new Date().getTime(), null));

        test.end();
    });

    test.test('resolve', function (test) {
        let loader = new TwingLoaderNull();

        test.same(loader.resolve('foo', null), null);

        test.end();
    });

    test.end();
});
