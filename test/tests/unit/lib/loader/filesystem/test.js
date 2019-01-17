const {
    TwingLoaderFilesystem,
    TwingErrorLoader,
    TwingSource,
    TwingEnvironment
} = require('../../../../../../build/index');

const tap = require('tape');
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

let arrayInheritanceTests = new Map([
    ['valid array inheritance', ['array_inheritance_valid_parent.html.twig']],
    ['array inheritance with null first template', ['array_inheritance_null_parent.html.twig']],
    ['array inheritance with empty first template', ['array_inheritance_empty_parent.html.twig']],
    ['array inheritance with non-existent first template', ['array_inheritance_nonexistent_parent.html.twig']]
]);

tap.test('loader filesystem', function (test) {
    test.test('constructor', function (test) {
        let loader = new TwingLoaderFilesystem(false);

        test.same(loader.getPaths(), []);

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let path = nodePath.resolve('test/tests/integration/fixtures');
        let loader = new TwingLoaderFilesystem([path]);

        test.same(loader.getSourceContext('errors/index.html').getName(), 'errors/index.html');
        test.same(nodePath.resolve(loader.getSourceContext('errors/index.html').getPath()), nodePath.resolve(nodePath.join(path, '/errors/index.html')));

        test.throws(function() {
            loader.getSourceContext('@foo/bar');
        }, new TwingErrorLoader('There are no registered paths for namespace "foo"'));

        test.throws(function() {
            loader.getSourceContext('@foo');
        }, new TwingErrorLoader('Malformed namespaced template name "@foo" (expecting "@namespace/template_name").'));

        test.throws(function() {
            loader.getSourceContext('../../../foo');
        }, new TwingErrorLoader('Looks like you try to load a template outside configured directories (../../../foo).'));

        test.test('use error cache on subsequent calls', function (test) {
            let validateNameStub = sinon.stub(loader, 'validateName');

            try {
                loader.getSourceContext('foo');
            }
            catch (e) {

            }

            try {
                loader.getSourceContext('foo');
            }
            catch (e) {

            }

            test.true(validateNameStub.calledOnce);

            test.end();
        });

        test.end();
    });

    test.test('security', function (test) {
        for (let securityTest of securityTests) {
            let template = securityTest[0];
            let loader = new TwingLoaderFilesystem([nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures')]);

            try {
                loader.getCacheKey(template);

                test.fail();
            }
            catch (e) {
                test.notSame(e.message, 'Unable to find template', e.message);
            }
        }

        test.end();
    });

    test.test('paths', function (test) {
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
            test.same(loader.getCacheKey('@named/named_absolute.html'), cacheKey);
            test.same(loader.getSourceContext('index.html').getCode(), "path (final)\n");
            test.same(loader.getSourceContext('@__main__/index.html').getCode(), "path (final)\n");
            test.same(loader.getSourceContext('@named/index.html').getCode(), "named path (final)\n");
        }

        let loader = new TwingLoaderFilesystem();
        let filePath = nodePath.resolve(nodePath.join(fixturesPath, 'named', 'index.html'));
        let missingPath = nodePath.resolve(nodePath.join(fixturesPath, 'missing'));

        test.throws(function () {
            loader.addPath(filePath);
        }, new TwingErrorLoader(`The "${filePath}" directory does not exist ("${filePath}").`));

        test.throws(function () {
            loader.addPath(missingPath);
        }, new TwingErrorLoader(`The "${missingPath}" directory does not exist ("${missingPath}").`));

        filePath = nodePath.resolve(nodePath.join(fixturesPath, 'named', 'index.html'));

        test.throws(function () {
            loader.prependPath(filePath);
        }, new TwingErrorLoader(`The "${filePath}" directory does not exist ("${filePath}").`));

        loader.prependPath(nodePath.join(fixturesPath, 'named'), 'foo');

        test.same(loader.getPaths('foo'), [nodePath.join(fixturesPath, 'named')]);

        test.end();
    });

    test.test('empty-constructor', function (test) {
        let loader = new TwingLoaderFilesystem();
        test.same(loader.getPaths(), []);

        test.end();
    });

    test.test('get-namespaces', function (test) {
        let loader = new TwingLoaderFilesystem(os.tmpdir());
        test.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE]);

        loader.addPath(os.tmpdir(), 'named');
        this.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE, 'named']);

        test.end();
    });

    test.test('find-template-exception-namespace', function (test) {
        let basePath = fixturesPath;

        let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal')]);
        loader.addPath(nodePath.join(basePath, 'named'), 'named');

        try {
            loader.getSourceContext('@named/nowhere.html');
        }
        catch (e) {
            test.same(e instanceof TwingErrorLoader, true);
            test.true(e.message.includes('Unable to find template "@named/nowhere.html"'));
        }

        test.end();
    });

    test.test('find-template-with-cache', function (test) {
        let basePath = fixturesPath;

        let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal')]);
        loader.addPath(nodePath.join(basePath, 'named'), 'named');

        // prime the cache for index.html in the named namespace
        let namedSource = loader.getSourceContext('@named/index.html').getCode();
        test.same(namedSource, "named path\n");

        // get index.html from the main namespace
        test.same(loader.getSourceContext('index.html').getCode(), "path\n");

        test.end();
    });

    test.test('load-template-and-render-block-with-cache', function (test) {
        let loader = new TwingLoaderFilesystem([]);
        loader.addPath(nodePath.join(fixturesPath, 'themes/theme2'));
        loader.addPath(nodePath.join(fixturesPath, 'themes/theme1'));
        loader.addPath(nodePath.join(fixturesPath, 'themes/theme1'), 'default_theme');

        let twing = new TwingEnvironment(loader);

        let template = twing.loadTemplate('blocks.html.twig');

        test.same(template.renderBlock('b1', {}), 'block from theme 1');

        template = twing.loadTemplate('blocks.html.twig');

        test.same(template.renderBlock('b2', {}), 'block from theme 2');

        test.end();
    });

    test.test('array-inheritance', function (test) {
        for (let [testMessage, arrayInheritanceTest] of arrayInheritanceTests) {
            let templateName = arrayInheritanceTest[0];
            let loader = new TwingLoaderFilesystem([]);
            loader.addPath(nodePath.join(fixturesPath, 'inheritance'));

            let twing = new TwingEnvironment(loader);
            let template = twing.loadTemplate(templateName);

            test.same(template.renderBlock('body', {}), 'VALID Child', testMessage);
        }

        test.end();
    });

    test.test('should normalize template name', function (test) {
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
            test.same(loader.getSourceContext(name), new TwingSource('named path\n', name, nodePath.resolve(fixturesPath, 'named/index.html')));
        }

        test.end();
    });

    test.test('addPath and prependPath should trim trailing slashes', function (test) {
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

    test.test('addPath and prependPath should reset the caches', function (test) {
        test.test('template cache and error cache should be separate objects', function(test) {
            // @see https://github.com/ericmorand/twing/issues/300
            let loader = new TwingLoaderFilesystem(fixturesPath);

            loader.prependPath(nodePath.join(fixturesPath, 'normal'));

            try {
                loader.getCacheKey('not-found.html');
            }
            catch (e) {
                // at that point, the error cache contains an entry for "not-found.html"
            }

            try {
                loader.getCacheKey('not-found.html');

                test.fail('The template cache has been polluted by the previous error');
            }
            catch (e) {
                test.pass('The template cache has not been polluted by the previous error');
            }

            test.end();
        });

        test.end();
    });

    test.test('exists', function (test) {
        let loader = new TwingLoaderFilesystem(fixturesPath);

        test.equals(loader.exists('foo'), false);
        test.equals(loader.exists('@foo/bar'), false);
        test.equals(loader.exists('@foo/bar'), false);

        test.end();
    });

    test.end();
});
