import * as tape from 'tape';
import * as sinon from "sinon";
import {resolve, join} from "path";

import {TwingLoaderChain} from "../../../../../../src/lib/loader/chain";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingLoaderFilesystem} from "../../../../../../src/lib/loader/filesystem";
import {TwingErrorLoader} from "../../../../../../src/lib/error/loader";
import {TwingError} from "../../../../../../src/lib/error";

let fixturesPath = resolve('test/tests/integration/fixtures');

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

        test.test('foo', (test) => {
            loader.getSourceContext('foo', null).then((source) => {
                test.same(source.getName(), 'foo');
                test.end();
            });
        });

        test.test('errors/index.html', (test) => {
            loader.getSourceContext('errors/index.html', null).then((source) => {
                test.same(source.getName(), 'errors/index.html');
                test.same(source.getCode(), 'baz');
                test.end();
            });
        });

        test.test('errors/base.html', (test) => {
            loader.getSourceContext('errors/base.html', null).then((source) => {
                test.same(source.getName(), join(fixturesPath, 'errors/base.html'));
                test.notSame(source.getCode(), 'baz');
                test.end();
            });
        });

        test.test('constructs error message based on loaders that throw loader errors', (test) => {
            let loader2 = new TwingLoaderArray({});

            sinon.stub(loader2, 'exists').returns(Promise.resolve(true));
            sinon.stub(loader2, 'getSourceContext').returns(Promise.reject(new TwingErrorLoader('foo', 1, null)));

            loader = new TwingLoaderChain([
                loader2
            ]);

            loader.getSourceContext('foo', null)
                .then(() => {
                    test.fail();
                    test.end();
                })
                .catch((e) => {
                    test.same(e.message, 'Template "foo" is not defined (foo at line 1).');
                    test.end();
                });
        });

        test.test('does not construct error message based on loaders that throw non-loader errors', (test) => {
            let loader2 = new TwingLoaderArray({});

            sinon.stub(loader2, 'exists').returns(Promise.resolve(true));
            sinon.stub(loader2, 'getSourceContext').returns(Promise.reject(new Error('foo')));

            loader = new TwingLoaderChain([
                loader2
            ]);

            loader.getSourceContext('foo', null)
                .then(() => {
                    test.fail();
                    test.end();
                })
                .catch((e) => {
                    test.same(e.message, 'Template "foo" is not defined.');
                    test.end();
                });
        });
    });

    test.test('getSourceContextWhenTemplateDoesNotExist', async (test) => {
        let loader = new TwingLoaderChain([]);

        try {
            await loader.getSourceContext('foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('getCacheKey', async (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(await loader.getCacheKey('foo', null), 'foo:bar');
        test.equals(await loader.getCacheKey('bar', null), 'bar:foo');

        let stub = sinon.stub(loader, 'getCacheKey').returns(Promise.reject(new TwingErrorLoader('foo', 1, null)));

        loader = new TwingLoaderChain([
            loader
        ]);

        try {
            await loader.getCacheKey('foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined (TwingLoaderChain: foo at line 1).');
        }

        stub.restore();

        let loader2 = new TwingLoaderArray({'foo': 'bar'});

        stub = sinon.stub(loader2, 'getCacheKey').returns(Promise.reject(new Error('foo')));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            await loader.getCacheKey('foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        stub.restore();

        test.end();
    });

    test.test('getCacheKeyWhenTemplateDoesNotExist', async (test) => {
        let loader = new TwingLoaderChain([]);

        try {
            await loader.getCacheKey('foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        test.end();
    });

    test.test('addLoader', (test) => {
        let loader = new TwingLoaderChain([]);
        loader.addLoader(new TwingLoaderArray({'foo': 'bar'}));

        loader.getSourceContext('foo', null).then((source) => {
            test.equals(source.getCode(), 'bar');

            test.end();
        });
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
        let loader1ExistsStub = sinon.stub(loader1, 'exists').returns(Promise.resolve(false));
        let loader1GetSourceContextSpy = sinon.spy(loader1, 'getSourceContext');

        let loader2 = new TwingLoaderArray({});
        let loader2ExistsStub = sinon.stub(loader2, 'exists').returns(Promise.resolve(true));
        let loader2GetSourceContextSpy = sinon.spy(loader2, 'getSourceContext');

        let loader3 = new TwingLoaderArray({});
        let loader3ExistsStub = sinon.stub(loader3, 'exists').returns(Promise.resolve(true));
        let loader3GetSourceContextSpy = sinon.spy(loader3, 'getSourceContext');

        test.test('resolves to true as soon as a loader resolves to true', async (test) => {
            let loader = new TwingLoaderChain([
                loader1,
                loader2,
                loader3
            ]);

            test.true(await loader.exists('foo', null));
            test.same(loader1ExistsStub.callCount, 1, 'loader 1 exists is called once');
            test.same(loader2ExistsStub.callCount, 1, 'loader 2 exists is called once');
            test.same(loader3ExistsStub.callCount, 0, 'loader 3 exists is not called');
            test.same(loader1GetSourceContextSpy.callCount, 0, 'loader 1 getSourceContext is not called');
            test.same(loader2GetSourceContextSpy.callCount, 0, 'loader 2 getSourceContext is not called');
            test.same(loader3GetSourceContextSpy.callCount, 0, 'loader 3 getSourceContext is not called');

            loader1ExistsStub.restore();
            loader2ExistsStub.restore();
            loader3ExistsStub.restore();

            test.end();
        });

        test.test('resolves to false is all loaders resolve to false', async (test) => {
            let loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            loader1ExistsStub = sinon.stub(loader1, 'exists').returns(Promise.resolve(false));
            loader2ExistsStub = sinon.stub(loader2, 'exists').returns(Promise.resolve(false));

            test.false(await loader.exists('foo', null));

            loader1ExistsStub.restore();
            loader2ExistsStub.restore();

            test.end();
        });

        test.test('hits cache on subsequent calls', async (test) => {
            let loader = new TwingLoaderChain([
                new TwingLoaderArray({
                    foo: 'foo'
                })
            ]);

            let spy = sinon.spy(loader.getLoaders()[0], 'exists');

            await loader.exists('foo', null);
            await loader.exists('foo', null);

            test.true(spy.calledOnce);

            spy.restore();

            test.end();
        });


        test.end();
    });

    test.test('isFresh', async (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'foo': 'foobar', 'bar': 'foo'}),
        ]);

        test.equals(await loader.isFresh('foo', 0, null), true);
        test.equals(await loader.isFresh('bar', 0, null), true);

        let stub = sinon.stub(loader, 'isFresh').returns(Promise.reject(new TwingErrorLoader('foo', 1, null)));

        loader = new TwingLoaderChain([
            loader
        ]);

        try {
            await loader.isFresh('foo', 0, null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined (TwingLoaderChain: foo at line 1).');
        }

        stub.restore();

        let loader2 = new TwingLoaderArray({'foo': 'bar'});

        stub = sinon.stub(loader2, 'isFresh').returns(Promise.reject(new Error('foo')));

        loader = new TwingLoaderChain([
            loader2
        ]);

        try {
            await loader.isFresh('foo', 0, null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "foo" is not defined.');
        }

        stub.restore();

        test.end();
    });

    test.test('resolve', async (test) => {
        let loader = new TwingLoaderChain([
            new TwingLoaderArray({'foo': 'bar'}),
            new TwingLoaderArray({'bar': 'foo'}),
        ]);

        test.equals(await loader.resolve('bar', null), 'bar');

        test.test('when some loaders throw an error', async (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').returns(Promise.reject(new TwingError('foo')));
            sinon.stub(loader1, 'exists').returns(Promise.resolve(true));

            let loader2 = new TwingLoaderArray({'bar': 'foo'});

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            test.equals(await loader.resolve('bar', null), 'bar');

            test.end();
        });

        test.test('when all loaders throw loader-related errors', async (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').returns(Promise.reject(new TwingErrorLoader('foo', 1, null)));
            sinon.stub(loader1, 'exists').returns(Promise.resolve(true));

            let loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').returns(Promise.reject(new TwingErrorLoader('bar', 1, null)));
            sinon.stub(loader2, 'exists').returns(Promise.resolve(true));

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            try {
                await loader.resolve('foo', null);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Template "foo" is not defined (TwingLoaderArray: foo at line 1, TwingLoaderArray: bar at line 1).');
            }

            test.end();
        });

        test.test('when all loaders throw non loader-related errors', async (test) => {
            let loader1 = new TwingLoaderArray({});
            sinon.stub(loader1, 'resolve').returns(Promise.reject(new TwingError('foo')));
            sinon.stub(loader1, 'exists').returns(Promise.resolve(true));

            let loader2 = new TwingLoaderArray({});
            sinon.stub(loader2, 'resolve').returns(Promise.reject(new TwingError('bar')));
            sinon.stub(loader2, 'exists').returns(Promise.resolve(true));

            loader = new TwingLoaderChain([
                loader1,
                loader2
            ]);

            try {
                await loader.resolve('foo', null);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Template "foo" is not defined.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
