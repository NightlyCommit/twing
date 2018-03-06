const TwingLoaderArray = require('../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingErrorLoader = require('../../../../../lib/twing/error/loader').TwingErrorLoader;

const tap = require('tap');
const nodePath = require('path');

tap.test('loader array', function (test) {
    test.test('constructor', function (test) {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            bar: 'foo'
        });

        test.true(loader.exists('foo'));
        test.true(loader.exists('bar'));

        loader = new TwingLoaderArray(['bar', 'foo']);

        test.true(loader.exists(0));
        test.true(loader.exists(1));

        loader = new TwingLoaderArray(new Map([
            ['foo', 'bar'],
            ['bar', 'foo']
        ]));

        test.true(loader.exists('foo'));
        test.true(loader.exists('bar'));

        test.end();
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', function (test) {
        let loader = new TwingLoaderArray({});

        test.throws(function() {
           loader.getSourceContext('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        test.end();
    });

    test.test('getCacheKey', function (test) {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.same(loader.getCacheKey('foo'), 'foo:bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateHasDuplicateContent', function (test) {
        let loader = new TwingLoaderArray({
            foo: 'bar',
            baz: 'bar'
        });

        test.same(loader.getCacheKey('foo'), 'foo:bar');
        test.same(loader.getCacheKey('baz'), 'baz:bar');

        test.end();
    });

    test.test('getCacheKeyIsProtectedFromEdgeCollisions', function (test) {
        let loader = new TwingLoaderArray({
            foo__: 'bar',
            foo: '__bar'
        });

        test.same(loader.getCacheKey('foo__'), 'foo__:bar');
        test.same(loader.getCacheKey('foo'), 'foo:__bar');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', function (test) {
        let loader = new TwingLoaderArray({});

        test.throws(function() {
            loader.getCacheKey('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        test.end();
    });

    test.test('setTemplate', function (test) {
        let loader = new TwingLoaderArray({});
        loader.setTemplate('foo', 'bar');

        test.same(loader.getSourceContext('foo').getCode(), 'bar');

        test.end();
    });

    test.test('isFresh', function (test) {
        let loader = new TwingLoaderArray({
            foo: 'bar'
        });

        test.true(loader.isFresh('foo', new Date().getTime()));

        test.end();
    });

    test.test('isFreshWhenTemplateDoesNotExist', function (test) {
        let loader = new TwingLoaderArray({});

        test.throws(function() {
            loader.isFresh('foo', new Date().getTime());
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        test.end();
    });

    test.end();
});
