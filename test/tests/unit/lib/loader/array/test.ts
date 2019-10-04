import * as tape from 'tape';
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";

tape('loader array', (test) => {
    test.test('constructor', (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            bar: 'foo'
        });

        test.true(loader.exists('foo', null));
        test.true(loader.exists('bar', null));

        loader = new TwingLoaderArray(new Map([
            ['foo', 'bar'],
            ['bar', 'foo']
        ]));

        test.true(loader.exists('foo', null));
        test.true(loader.exists('bar', null));

        loader = new TwingLoaderArray(1);

        test.false(loader.exists('foo', null));
        test.false(loader.exists('bar', null));

        test.end();
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', (test) => {
        let loader = new TwingLoaderArray({});

        try {
            loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('getCacheKey', (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.same(loader.getCacheKey('foo', null), 'foo:bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateHasDuplicateContent', (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            baz: 'bar'
        });

        test.same(loader.getCacheKey('foo', null), 'foo:bar');
        test.same(loader.getCacheKey('baz', null), 'baz:bar');

        test.end();
    });

    test.test('getCacheKeyIsProtectedFromEdgeCollisions', (test) => {
        let loader = new TwingLoaderArray({
            foo__: 'bar',
            foo: '__bar'
        });

        test.same(loader.getCacheKey('foo__', null), 'foo__:bar');
        test.same(loader.getCacheKey('foo', null), 'foo:__bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', (test) => {
        let loader = new TwingLoaderArray({});

        try {
            loader.getCacheKey('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('setTemplate', (test) => {
        let loader = new TwingLoaderArray({});
        loader.setTemplate('foo', 'bar');

        test.same(loader.getSourceContext('foo', null).getCode(), 'bar');

        test.end();
    });

    test.test('isFresh', (test) => {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.true(loader.isFresh('foo', new Date().getTime(), null));

        test.end();
    });

    test.test('isFreshWhenTemplateDoesNotExist', (test) => {
        let loader = new TwingLoaderArray({});

        try {
            loader.isFresh('foo', new Date().getTime(), null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.end();
});
