import * as tape from 'tape';
import {TwingLoaderChain} from "../../../../../../src/lib/loader/chain";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingLoaderFilesystem} from "../../../../../../src/lib/loader/filesystem";
import {TwingErrorLoader} from "../../../../../../src/lib/error/loader";
import {TwingError} from "../../../../../../src/lib/error";

const nodePath = require('path');
const sinon = require('sinon');

let fixturesPath = nodePath.resolve('test/tests/integration/fixtures');

tape('loader chain', (test) => {
    test.test('constructor', (test) => {
        test.test('should accept zero parameters', (test) => {
            let loader = new TwingLoaderChain();

            test.ok(loader);

            test.end();
        });

        test.end();
    });

    test.test('getSourceContext', (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'errors/index.html': 'baz'}),
            new TwingLoaderFilesystem([fixturesPath]),
        ]);

        test.equals(loader.getSourceContext('foo', null).getName(), 'foo');
        test.same(loader.getSourceContext('foo', null).getPath(), '');

        test.equals(loader.getSourceContext('errors/index.html', null).getName(), 'errors/index.html');
        test.same(loader.getSourceContext('errors/index.html', null).getPath(), '');
        test.equals(loader.getSourceContext('errors/index.html', null).getCode(), 'baz');

        test.equals(loader.getSourceContext('errors/base.html', null).getName(), 'errors/base.html');
        test.equals(nodePath.resolve(loader.getSourceContext('errors/base.html', null).getPath()), nodePath.join(fixturesPath, 'errors/base.html'));
        test.notEquals(loader.getSourceContext('errors/base.html', null).getCode(), 'baz');

        let loader2 = new TwingLoaderArray({'foo': 'bar'});

        let stub = sinon.stub(loader2, 'getSourceContext').throws(new TwingErrorLoader('foo', 1, null));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined (foo at line 1).');
        }

        stub.restore();

        loader2 = new TwingLoaderArray({'foo': 'bar'});

        stub = sinon.stub(loader2, 'getSourceContext').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            loader.getSourceContext('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        stub.restore();

        test.end();
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', (test) => {
        let loader = new TwingLoaderChain([]);

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
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(loader.getCacheKey('foo', null), 'foo:bar');
        test.equals(loader.getCacheKey('bar', null), 'bar:foo');

        let stub = sinon.stub(loader, 'getCacheKey').throws(new TwingErrorLoader('foo', 1, null));

        loader = new TwingLoaderChain([
            loader
        ]);

        try {
            loader.getCacheKey('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined (TwingLoaderChain: foo at line 1).');
        }

        stub.restore();

        let loader2 = new TwingLoaderArray({'foo': 'bar'});

        stub = sinon.stub(loader2, 'getCacheKey').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            loader.getCacheKey('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        stub.restore();

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', (test) => {
        let loader = new TwingLoaderChain([]);

        try {
            loader.getCacheKey('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('addLoader', (test) => {
        let loader = new TwingLoaderChain([]);
        loader.addLoader(new TwingLoaderArray({'foo': 'bar'}));

        test.equals(loader.getSourceContext('foo', null).getCode(), 'bar');

        test.end();
    });

    test.test('getLoaders', (test) => {
        let loaders = [
            new TwingLoaderArray({'foo': 'bar'})
        ];

        let loader = new TwingLoaderChain(loaders);

        test.same(loader.getLoaders(), loaders);

        test.end();
    });

    test.test('exists', (test) => {
        let loader1 = new TwingLoaderArray({});
        sinon.stub(loader1, 'exists').returns(false);
        sinon.stub(loader1, 'getSourceContext');

        let loader2 = new TwingLoaderArray({});
        sinon.stub(loader2, 'exists').returns(true);
        sinon.stub(loader2, 'getSourceContext');

        let loader = new TwingLoaderChain([]);
        loader.addLoader(loader1);
        loader.addLoader(loader2);

        test.true(loader.exists('foo', null));

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

        test.false(loader.exists('missing', null));
        test.false(loader.exists('missing', null));
        test.equals(loader1ExistsStub.callCount, 1);
        test.equals(loader2ExistsStub.callCount, 1);

        test.end();
    });

    test.test('isFresh', (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(loader.isFresh('foo', 0, null), true);
        test.equals(loader.isFresh('bar', 0, null), true);

        let stub = sinon.stub(loader, 'isFresh').throws(new TwingErrorLoader('foo', 1, null));

        loader = new TwingLoaderChain([
            loader
        ]);

        try {
            loader.isFresh('foo', 0, null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined (TwingLoaderChain: foo at line 1).');
        }

        stub.restore();

        let loader2 = new TwingLoaderArray({'foo': 'bar'});

        stub = sinon.stub(loader2, 'isFresh').throws(new Error('foo'));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            loader.isFresh('foo', 0, null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        stub.restore();

        test.end();
    });

    test.test('resolve', (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'bar': 'foo'}),
        ]);

        test.equals(loader.resolve('bar', null), 'bar');

        test.test('when some loaders throw an error', (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingError('foo'));
            sinon.stub(loader1, 'exists').returns(true);

            let loader2 = new TwingLoaderArray({'bar': 'foo'});

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            test.equals(loader.resolve('bar', null), 'bar');

            test.end();
        });

        test.test('when all loaders throw loader-related errors', (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingErrorLoader('foo', 1, null));
            sinon.stub(loader1, 'exists').returns(true);

            let loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').throws(new TwingErrorLoader('bar', 1, null));
            sinon.stub(loader2, 'exists').returns(true);

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            try {
                loader.resolve('foo', null);

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'Template "foo" is not defined (TwingLoaderArray: foo at line 1, TwingLoaderArray: bar at line 1).');
            }

            test.end();
        });

        test.test('when all loaders throw non loader-related errors', (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').throws(new TwingError('foo'));
            sinon.stub(loader1, 'exists').returns(true);

            let loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').throws(new TwingError('bar'));
            sinon.stub(loader2, 'exists').returns(true);

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            try {
                loader.resolve('foo', null);

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'Template "foo" is not defined.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
