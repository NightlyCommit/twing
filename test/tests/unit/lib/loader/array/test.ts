import * as tape from 'tape';
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";

tape('loader array', (test) => {
    test.test('constructor', async (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            bar: 'foo'
        });

        test.true(await loader.exists('foo', null));
        test.true(await loader.exists('bar', null));

        loader = new TwingLoaderArray(new Map([
            ['foo', 'bar'],
            ['bar', 'foo']
        ]));

        test.true(await loader.exists('foo', null));
        test.true(await loader.exists('bar', null));

        loader = new TwingLoaderArray(1);

        test.false(await loader.exists('foo', null));
        test.false(await loader.exists('bar', null));

        test.end();
    });

    test.test('resolve', async (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            bar: 'foo'
        });

        test.same(await loader.resolve('foo', null), 'foo');
        test.same(await loader.resolve('bar', null), 'bar');

        loader = new TwingLoaderArray(1);

        test.same(await loader.resolve('foo', null), null);
        test.same(await loader.resolve('bar', null), null);

        try {
            await loader.resolve('foo', null, true);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', async (test) => {
        let loader = new TwingLoaderArray({});

        try {
            await loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('getCacheKey', async (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.same(await loader.getCacheKey('foo', null), 'foo:bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateHasDuplicateContent', async (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            baz: 'bar'
        });

        test.same(await loader.getCacheKey('foo', null), 'foo:bar');
        test.same(await loader.getCacheKey('baz', null), 'baz:bar');

        test.end();
    });

    test.test('getCacheKeyIsProtectedFromEdgeCollisions', async (test) => {
        let loader = new TwingLoaderArray({
            foo__: 'bar',
            foo: '__bar'
        });

        test.same(await loader.getCacheKey('foo__', null), 'foo__:bar');
        test.same(await loader.getCacheKey('foo', null), 'foo:__bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', async (test) => {
        let loader = new TwingLoaderArray({});

        try {
            await loader.getCacheKey('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('setTemplate', async (test) => {
        let loader = new TwingLoaderArray({});

        loader.setTemplate('foo', 'bar');

        test.same((await loader.getSourceContext('foo', null)).getCode(), 'bar');

        test.end();
    });

    test.test('isFresh', async (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.true(await loader.isFresh('foo', new Date().getTime(), null));

        test.end();
    });

    test.test('isFreshWhenTemplateDoesNotExist', async (test) => {
        let loader = new TwingLoaderArray({});

        try {
            await loader.isFresh('foo', new Date().getTime(), null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.end();
});
