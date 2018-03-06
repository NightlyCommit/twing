const TwingLoaderChain = require('../../../../../lib/twing/loader/chain').TwingLoaderChain;
const TwingLoaderArray = require('../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingLoaderFilesystem = require('../../../../../lib/twing/loader/filesystem').TwingLoaderFilesystem;
const TwingErrorLoader = require('../../../../../lib/twing/error/loader').TwingErrorLoader;

const tap = require('tap');
const nodePath = require('path');
const sinon = require('sinon');

let fixturesPath = nodePath.resolve('test/tests/integration/fixtures');

tap.test('loader chain', function (test) {
    test.test('constructor', function(test) {
        test.test('should accept zero parameters', function(test) {
            let loader = new TwingLoaderChain();

            test.ok(loader);

            test.end();
        });

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'errors/index.html': 'baz'}),
            new TwingLoaderFilesystem([fixturesPath]),
        ]);

        test.equals(loader.getSourceContext('foo').getName(), 'foo');
        test.same(loader.getSourceContext('foo').getPath(), '');

        test.equals(loader.getSourceContext('errors/index.html').getName(), 'errors/index.html');
        test.same(loader.getSourceContext('errors/index.html').getPath(), '');
        test.equals(loader.getSourceContext('errors/index.html').getCode(), 'baz');

        test.equals(loader.getSourceContext('errors/base.html').getName(), 'errors/base.html');
        test.equals(nodePath.resolve(loader.getSourceContext('errors/base.html').getPath()), nodePath.join(fixturesPath, 'errors/base.html'));
        test.notEquals(loader.getSourceContext('errors/base.html').getCode(), 'baz');

        test.end();
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', function (test) {
        let loader = new TwingLoaderChain([]);

        test.throws(function () {
            loader.getSourceContext('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        test.end();
    });

    test.test('getCacheKey', function (test) {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(loader.getCacheKey('foo'), 'foo:bar');
        test.equals(loader.getCacheKey('bar'), 'bar:foo');

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', function (test) {
        let loader = new TwingLoaderChain([]);

        test.throws(function () {
            loader.getCacheKey('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        test.end();
    });

    test.test('addLoader', function (test) {
        let loader = new TwingLoaderChain([]);
        loader.addLoader(new TwingLoaderArray({'foo': 'bar'}));

        test.equals(loader.getSourceContext('foo').getCode(), 'bar');

        test.end();
    });

    test.test('exists', function (test) {
        let loader1 = new TwingLoaderArray({});
        sinon.stub(loader1, 'exists').returns(false);
        sinon.stub(loader1, 'getSourceContext');

        let loader2 = new TwingLoaderArray({});
        sinon.stub(loader2, 'exists').returns(true);
        sinon.stub(loader2, 'getSourceContext');

        let loader = new TwingLoaderChain([]);
        loader.addLoader(loader1);
        loader.addLoader(loader2);

        test.true(loader.exists('foo'));

        sinon.assert.calledOnce(loader1['exists']);
        sinon.assert.notCalled(loader1['getSourceContext']);

        sinon.assert.calledOnce(loader2['exists']);
        sinon.assert.notCalled(loader2['getSourceContext']);

        test.end();
    });

    test.end();
});
