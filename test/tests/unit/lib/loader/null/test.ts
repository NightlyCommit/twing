import * as tape from 'tape';
import {TwingLoaderNull} from "../../../../../../src/lib/loader/null";

tape('loader null', (test) => {
    test.test('getSourceContext', async (test) => {
        let loader = new TwingLoaderNull();

        try {
            await loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('exists', async (test) => {
        let loader = new TwingLoaderNull();

        test.same(await loader.exists('foo', null), false);

        test.end();
    });

    test.test('getCacheKey', async (test) => {
        let loader = new TwingLoaderNull();

        test.same(await loader.getCacheKey('foo', null), 'foo');

        test.end();
    });

    test.test('isFresh', async (test) => {
        let loader = new TwingLoaderNull();

        test.true(await loader.isFresh('foo', new Date().getTime(), null));

        test.end();
    });

    test.test('resolve', async (test) => {
        let loader = new TwingLoaderNull();

        test.same(await loader.resolve('foo', null), null);

        try {
            await loader.resolve('foo', null, true);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.end();
});
