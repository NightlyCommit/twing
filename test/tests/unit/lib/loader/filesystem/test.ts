import * as tape from 'tape';
import {TwingLoaderFilesystem} from "../../../../../../src/lib/loader/filesystem";
import {TwingErrorLoader} from "../../../../../../src/lib/error/loader";
import {TwingSource} from "../../../../../../src/lib/source";
import * as fs from "fs";
import {stub} from "sinon";

const nodePath = require('path');
const os = require('os');
const sinon = require('sinon');

let fixturesPath = nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures');

let basePaths = [
    [
        fixturesPath,
        'test/tests/unit/lib/loader/filesystem/fixtures/named_quater/named_absolute.html',
        null
    ],
    [
        nodePath.join(fixturesPath, '../fixtures'),
        'test/tests/unit/lib/loader/filesystem/fixtures/named_quater/named_absolute.html',
        null
    ],
    [
        'test/tests/unit/lib/loader/filesystem/fixtures',
        'test/tests/unit/lib/loader/filesystem/fixtures/named_quater/named_absolute.html',
        process.cwd()
    ],
    [
        'fixtures',
        'fixtures/named_quater/named_absolute.html',
        nodePath.join(process.cwd(), 'test/tests/unit/lib/loader/filesystem')
    ],
    [
        'fixtures',
        'fixtures/named_quater/named_absolute.html',
        nodePath.join(process.cwd(), 'test/../test/tests/unit/lib/loader/filesystem')
    ]
];

let securityTests = [
    ["AutoloaderTest\0.php"],
    ['..\\AutoloaderTest.php'],
    ['..\\\\\\AutoloaderTest.php'],
    ['../AutoloaderTest.php'],
    ['..////AutoloaderTest.php'],
    ['./../AutoloaderTest.php'],
    ['.\\..\\AutoloaderTest.php'],
    ['././././././../AutoloaderTest.php'],
    ['.\\./.\\./.\\./../AutoloaderTest.php'],
    ['foo/../../AutoloaderTest.php'],
    ['foo\\..\\..\\AutoloaderTest.php'],
    ['foo/../bar/../../AutoloaderTest.php'],
    ['foo/bar/../../../AutoloaderTest.php'],
    ['filters/../../AutoloaderTest.php'],
    ['filters//..//..//AutoloaderTest.php'],
    ['filters\\..\\..\\AutoloaderTest.php'],
    ['filters\\\\..\\\\..\\\\AutoloaderTest.php'],
    ['filters\\//../\\/\\..\\AutoloaderTest.php'],
    ['/../AutoloaderTest.php'],
];

tape('loader filesystem', (test) => {
    test.test('constructor', (test) => {
        let loader = new TwingLoaderFilesystem([]);

        test.same(loader.getPaths(), []);

        test.end();
    });

    test.test('getSourceContext', async (test) => {
        class CustomLoader extends TwingLoaderFilesystem {
            validateName(name: string) {
                super.validateName(name);
            }
        }

        let path = nodePath.resolve('test/tests/integration/fixtures');
        let loader = new CustomLoader([path]);

        test.same((await loader.getSourceContext('errors/index.html', null)).getName(), nodePath.resolve(nodePath.join(path, '/errors/index.html')));

        try {
            await loader.getSourceContext('@foo/bar', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'There are no registered paths for namespace "foo".');
        }

        try {
            await loader.getSourceContext('@foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Malformed namespaced template name "@foo" (expecting "@namespace/template_name").');
        }

        try {
            await loader.getSourceContext('../../../foo', null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Looks like you try to load a template outside configured directories (../../../foo).');
        }

        test.test('use error cache on subsequent calls', async (test) => {
            let validateNameSpy = sinon.spy(loader, 'validateName');

            try {
                await loader.getSourceContext('foo', null);
            } catch (e) {

            }

            try {
                await loader.getSourceContext('foo', null);
            } catch (e) {

            }

            test.true(validateNameSpy.calledOnce);

            test.end();
        });

        test.end();
    });

    test.test('security', async (test) => {
        for (let securityTest of securityTests) {
            let template = securityTest[0];
            let loader = new TwingLoaderFilesystem([nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures')]);

            try {
                await loader.getCacheKey(template, null);

                test.fail();
            } catch (e) {
                test.notSame(e.message, 'Unable to find template', e.message);
            }
        }

        test.end();
    });

    test.test('paths', async (test) => {
        for (let basePathArray of basePaths) {
            let basePath = basePathArray[0];
            let cacheKey = basePathArray[1];
            let rootPath = basePathArray[2];

            let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal'), nodePath.join(basePath, 'normal_bis')], rootPath);
            loader.setPaths([nodePath.join(basePath, 'named'), nodePath.join(basePath, 'named_bis')], 'named');
            loader.addPath(nodePath.join(basePath, 'named_ter'), 'named');
            loader.addPath(nodePath.join(basePath, 'normal_ter'));
            loader.prependPath(nodePath.join(basePath, 'normal_final'));
            loader.prependPath(nodePath.join(basePath, 'named/../named_quater'), 'named');
            loader.prependPath(nodePath.join(basePath, 'named_final'), 'named');

            test.same([
                nodePath.join(basePath, 'normal_final'),
                nodePath.join(basePath, 'normal'),
                nodePath.join(basePath, 'normal_bis'),
                nodePath.join(basePath, 'normal_ter')
            ], loader.getPaths());

            test.same([
                nodePath.join(basePath, 'named_final'),
                nodePath.join(basePath, 'named/../named_quater'),
                nodePath.join(basePath, 'named'),
                nodePath.join(basePath, 'named_bis'),
                nodePath.join(basePath, 'named_ter')
            ], loader.getPaths('named'));

            // do not use realpath here as it would make the test useless
            test.same(await loader.getCacheKey('@named/named_absolute.html', null), cacheKey);
            test.same((await loader.getSourceContext('index.html', null)).getCode(), "path (final)\n");
            test.same((await loader.getSourceContext('@__main__/index.html', null)).getCode(), "path (final)\n");
            test.same((await loader.getSourceContext('@named/index.html', null)).getCode(), "named path (final)\n");
        }

        let loader = new TwingLoaderFilesystem();
        let filePath = nodePath.resolve(nodePath.join(fixturesPath, 'named', 'index.html'));
        let missingPath = nodePath.resolve(nodePath.join(fixturesPath, 'missing'));

        try {
            loader.addPath(filePath);

            test.fail();
        } catch (e) {
            test.same(e.message, `The "${filePath}" directory does not exist ("${filePath}").`);
        }

        try {
            loader.addPath(missingPath);

            test.fail();
        } catch (e) {
            test.same(e.message, `The "${missingPath}" directory does not exist ("${missingPath}").`);
        }

        filePath = nodePath.resolve(nodePath.join(fixturesPath, 'named', 'index.html'));

        try {
            loader.prependPath(filePath);

            test.fail();
        } catch (e) {
            test.same(e.message, `The "${filePath}" directory does not exist ("${filePath}").`);
        }

        loader.prependPath(nodePath.join(fixturesPath, 'named'), 'foo');

        test.same(loader.getPaths('foo'), [nodePath.join(fixturesPath, 'named')]);

        test.end();
    });

    test.test('empty-constructor', (test) => {
        let loader = new TwingLoaderFilesystem();

        test.same(loader.getPaths(), []);
        test.same(loader.getPaths('foo'), []);

        test.end();
    });

    test.test('get-namespaces', (test) => {
        let loader = new TwingLoaderFilesystem(os.tmpdir());

        test.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE]);

        loader.addPath(os.tmpdir(), 'named');

        test.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE, 'named']);

        test.end();
    });

    test.test('find-template-exception-namespace', async (test) => {
        let basePath = fixturesPath;

        let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal')]);
        loader.addPath(nodePath.join(basePath, 'named'), 'named');

        try {
            await loader.getSourceContext('@named/nowhere.html', null);
        } catch (e) {
            test.same(e instanceof TwingErrorLoader, true);
            test.true(e.message.includes('Unable to find template "@named/nowhere.html"'));
        }

        test.end();
    });

    test.test('find-template-with-cache', async (test) => {
        let basePath = fixturesPath;

        let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal')]);

        loader.addPath(nodePath.join(basePath, 'named'), 'named');

        // prime the cache for index.html in the named namespace
        let namedSource = (await loader.getSourceContext('@named/index.html', null)).getCode();

        test.same(namedSource, "named path\n");

        // get index.html from the main namespace
        test.same((await loader.getSourceContext('index.html', null)).getCode(), "path\n");

        test.end();
    });

    test.test('should normalize template name', async (test) => {
        let loader = new TwingLoaderFilesystem(fixturesPath);

        let names = [
            'named/index.html',
            'named//index.html',
            'named///index.html',
            '../fixtures/named/index.html',
            '..//fixtures//named//index.html',
            '..///fixtures///named///index.html',
            'named\\index.html',
            'named\\\\index.html',
            'named\\\\\\index.html',
            '..\\fixtures\\named\\index.html',
            '..\\\\fixtures\\\\named\\\\index.html',
            '..\\\\\\fixtures\\named\\\\\\index.html',
        ];

        for (let name of names) {
            test.same(await loader.getSourceContext(name, null), new TwingSource('named path\n', nodePath.resolve(fixturesPath, 'named/index.html')));
        }

        try {
            await loader.getSourceContext(null, null);

            test.fail();
        } catch (e) {
            test.true(e.message.startsWith('Unable to find template ""'));
        }

        test.end();
    });

    test.test('addPath and prependPath should trim trailing slashes', (test) => {
        // ensure that trailing slashes are removed by addPath
        let loader = new TwingLoaderFilesystem(fixturesPath);
        loader.addPath(nodePath.join(fixturesPath, 'normal/'));
        loader.addPath(nodePath.join(fixturesPath, 'normal//'));
        loader.addPath(nodePath.join(fixturesPath, 'normal\\'));
        loader.addPath(nodePath.join(fixturesPath, 'normal\\\\'));

        test.same(loader.getPaths(), [
            fixturesPath,
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal')
        ]);

        // ensure that trailing slashes are removed by prependPath
        loader = new TwingLoaderFilesystem(fixturesPath);
        loader.prependPath(nodePath.join(fixturesPath, 'normal/'));
        loader.prependPath(nodePath.join(fixturesPath, 'normal//'));
        loader.prependPath(nodePath.join(fixturesPath, 'normal\\'));
        loader.prependPath(nodePath.join(fixturesPath, 'normal\\\\'));

        test.same(loader.getPaths(), [
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal'),
            nodePath.join(fixturesPath, 'normal'),
            fixturesPath
        ]);

        test.end();
    });

    test.test('addPath and prependPath should reset the caches', (test) => {
        test.test('template cache and error cache should be separate objects', async (test) => {
            // @see https://github.com/ericmorand/twing/issues/300
            let loader = new TwingLoaderFilesystem(fixturesPath);

            loader.prependPath(nodePath.join(fixturesPath, 'normal'));

            try {
                await loader.getCacheKey('not-found.html', null);
            } catch (e) {
                // at that point, the error cache contains an entry for "not-found.html"
            }

            try {
                await loader.getCacheKey('not-found.html', null);

                test.fail('The template cache has been polluted by the previous error');
            } catch (e) {
                test.pass('The template cache has not been polluted by the previous error');
            }

            test.end();
        });

        test.end();
    });

    test.test('exists', async (test) => {
        let loader = new TwingLoaderFilesystem(fixturesPath);

        test.equals(await loader.exists('foo', null), false);
        test.equals(await loader.exists('@foo/bar', null), false);
        test.equals(await loader.exists('@foo/bar', null), false);

        loader = new TwingLoaderFilesystem([]);

        test.equals(await loader.exists("foo\0.twig", null), false);
        test.equals(await loader.exists('@foo', null), false);
        test.equals(await loader.exists('foo', null), false);
        test.equals(await loader.exists('@foo/bar.twig', null), false);

        loader.addPath(nodePath.join(fixturesPath, 'normal'));
        test.equals(await loader.exists('index.html', null), true);
        loader.addPath(nodePath.join(fixturesPath, 'normal'), 'foo');
        test.equals(await loader.exists('@foo/index.html', null), true);

        test.test('on cache hit', async (test) => {
            class CustomLoader extends TwingLoaderFilesystem {
                findTemplate(name: string, throw_: boolean = true, from: TwingSource = null): Promise<string> {
                    return super.findTemplate(name, throw_, from);
                }
            }

            let loader = new CustomLoader(nodePath.join(fixturesPath, 'normal'));

            await loader.getSourceContext('index.html', null);

            let spy = sinon.spy(loader, 'findTemplate');

            test.true(await loader.exists('index.html', null));
            test.true(spy.notCalled, 'findTemplate is not called');

            test.end();
        });

        test.end();
    });

    test.test('resolve', async (test) => {
        let loader = new TwingLoaderFilesystem(fixturesPath);

        test.equals(await loader.resolve('named/index.html', null), nodePath.resolve(nodePath.join(fixturesPath, 'named/index.html')));

        test.end();
    });

    test.test('findTemplate', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let CustomLoader = class extends TwingLoaderFilesystem {
            findTemplate(name: string, throw_: boolean = true, from: TwingSource = null): Promise<string> {
                return super.findTemplate(name, throw_, from);
            }
        };

        let loader = new CustomLoader('test/tests/unit/lib/loader/filesystem/fixtures');

        test.same(await loader.findTemplate('named/index.html', undefined, undefined), resolvePath('named/index.html'));
        test.same(await loader.findTemplate('named', false, undefined), null);

        try {
            await loader.findTemplate(resolvePath('named'), undefined, undefined);
        } catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "${resolvePath('named')}" (looked into: test/tests/unit/lib/loader/filesystem/fixtures).`);
        }

        test.test('find-template-with-error-cache', async (test) => {
            await loader.findTemplate('non-existing', false, null);

            let spy = sinon.spy(loader, 'validateName');

            test.same(await loader.findTemplate('non-existing', false, null), null);
            test.same(spy.callCount, 0);

            spy.restore();

            test.end();
        });

        test.end();
    });

    test.end();
});
