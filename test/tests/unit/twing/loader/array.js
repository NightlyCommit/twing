const TwingLoaderArray = require('../../../../../lib/twing/loader/array').TwingLoaderArray;

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

    test.end();
});
