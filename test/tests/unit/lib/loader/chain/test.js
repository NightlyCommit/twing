const {
    TwingLoaderChain,
    TwingLoaderArray,
    TwingLoaderFilesystem,
    TwingErrorLoader,
    TwingError
} = require('../../../../../../dist/index');

const tap = require('tape');
const nodePath = require('path');
const sinon = require('sinon');

let fixturesPath = nodePath.resolve('test/tests/integration/fixtures');

tap.test('loader chain', function (test) {
    test.test('constructor', function (test) {
        test.test('should accept zero parameters', function (test) {
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

        loader = new TwingLoaderArray({'foo': 'bar'});

        let stub = sinon.stub(loader, 'getSourceContext').throws(new TwingErrorLoader('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.getSourceContext('foo');
        }, new TwingErrorLoader('Template "foo" is not defined (foo).'));

        stub.restore();

        loader = new TwingLoaderArray({'foo': 'bar'});
        stub = sinon.stub(loader, 'getSourceContext').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.getSourceContext('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        stub.restore();

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

        let stub = sinon.stub(loader, 'getCacheKey').throws(new TwingErrorLoader('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.getCacheKey('foo');
        }, new TwingErrorLoader('Template "foo" is not defined (TwingLoaderChain: foo).'));

        stub.restore();

        loader = new TwingLoaderArray({'foo': 'bar'});
        stub = sinon.stub(loader, 'getCacheKey').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.getCacheKey('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        stub.restore();

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

        loader1 = new TwingLoaderArray({});
        let loader1ExistsStub = sinon.stub(loader1, 'exists');

        loader2 = new TwingLoaderArray({});
        let loader2ExistsStub = sinon.stub(loader2, 'exists');

        loader = new TwingLoaderChain([]);
        loader.addLoader(loader1);
        loader.addLoader(loader2);

        test.false(loader.exists('missing'));
        test.false(loader.exists('missing'));
        test.equals(loader1ExistsStub.callCount, 1);
        test.equals(loader2ExistsStub.callCount, 1);

        test.end();
    });

    test.test('isFresh', function (test) {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(loader.isFresh('foo', 0), true);
        test.equals(loader.isFresh('bar', 0), true);

        let stub = sinon.stub(loader, 'isFresh').throws(new TwingErrorLoader('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.isFresh('foo');
        }, new TwingErrorLoader('Template "foo" is not defined (TwingLoaderChain: foo).'));

        stub.restore();

        loader = new TwingLoaderArray({'foo': 'bar'});
        stub = sinon.stub(loader, 'isFresh').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader
        ]);

        test.throws(function () {
            loader.isFresh('foo');
        }, new TwingErrorLoader('Template "foo" is not defined.'));

        stub.restore();

        test.end();
    });

    test.test('resolve', (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'bar': 'foo'}),
        ]);

        test.equals(loader.resolve('bar'), 'bar');

        test.test('when some loaders throw an error', (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingError('foo'));
            sinon.stub(loader1, 'exists').returns(true);

            let loader2 = new TwingLoaderArray({'bar': 'foo'});

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            test.equals(loader.resolve('bar'), 'bar');

            test.end();
        });

        test.test('when all loaders throw loader-related errors', (test) => {
            loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingErrorLoader('foo'));
            sinon.stub(loader1, 'exists').returns(true);

            loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').throws(new TwingErrorLoader('bar'));
            sinon.stub(loader2, 'exists').returns(true);

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            test.throws(() => {
                loader.resolve('bar');
            }, new TwingErrorLoader('Template "bar" is not defined (TwingLoaderArray: foo, TwingLoaderArray: bar).'));

            test.end();
        });

        test.test('when all loaders throw non loader-related errors', (test) => {
            loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingError('foo'));
            sinon.stub(loader1, 'exists').returns(true);

            loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').throws(new TwingError('bar'));
            sinon.stub(loader2, 'exists').returns(true);

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            test.throws(() => {
                loader.resolve('bar');
            }, new TwingErrorLoader('Template "bar" is not defined.'));

            test.end();
        });

        test.end();
    });

    test.end();
});
