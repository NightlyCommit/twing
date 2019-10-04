import * as tape from 'tape';
import {TwingLoaderNull} from "../../../../../../src/lib/loader/null";

tape('loader array', (test) => {
    test.test('getSourceContext', (test) => {
        let loader = new TwingLoaderNull();

        try {
            loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('exists', (test) => {
        let loader = new TwingLoaderNull();

        test.same(loader.exists('foo', null), false);

        test.end();
    });

    test.test('getCacheKey', (test) => {
        let loader = new TwingLoaderNull();

        test.same(loader.getCacheKey('foo', null), 'foo');

        test.end();
    });

    test.test('isFresh', (test) => {
        let loader = new TwingLoaderNull();

        test.true(loader.isFresh('foo', new Date().getTime(), null));

        test.end();
    });

    test.test('resolve', (test) => {
        let loader = new TwingLoaderNull();

        test.same(loader.resolve('foo', null), 'foo');

        test.end();
    });

    test.end();
});
