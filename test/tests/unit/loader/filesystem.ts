import {Test} from "tape";
import TwingLoaderFilesystem from "../../../../src/loader/filesystem";
import TwingErrorLoader from "../../../../src/error/loader";
import TwingEnvironment from "../../../../src/environment";

const tap = require('tap');
const nodePath = require('path');
const os = require('os');

let fixturesPath = nodePath.resolve('test/tests/unit/loader/fixtures');

let basePaths = [
    [
        fixturesPath,
        'test/tests/unit/loader/fixtures/named_quater/named_absolute.html',
        null
    ],
    [
        nodePath.join(fixturesPath, '../fixtures'),
        'test/tests/unit/loader/fixtures/named_quater/named_absolute.html',
        null
    ],
    [
        'test/tests/unit/loader/fixtures',
        'test/tests/unit/loader/fixtures/named_quater/named_absolute.html',
        process.cwd()
    ],
    [
        'fixtures',
        'fixtures/named_quater/named_absolute.html',
        nodePath.join(process.cwd(), 'test/tests/unit/loader')
    ],
    [
        'fixtures',
        'fixtures/named_quater/named_absolute.html',
        nodePath.join(process.cwd(), 'test/../test/tests/unit/loader')
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
    ['array inheritance with null first template',  ['array_inheritance_null_parent.html.twig']],
    ['array inheritance with empty first template',  ['array_inheritance_empty_parent.html.twig']],
    ['array inheritance with non-existent first template', ['array_inheritance_nonexistent_parent.html.twig']]
]);

tap.test('loader filesystem', function (test: Test) {
    test.test('getSourceContext', function (test: Test) {
        let path = nodePath.resolve('test/tests/integration/fixtures');
        let loader = new TwingLoaderFilesystem([path]);

        test.same(loader.getSourceContext('errors/index.html').getName(), 'errors/index.html');
        test.same(nodePath.resolve(loader.getSourceContext('errors/index.html').getPath()), nodePath.resolve(nodePath.join(path, '/errors/index.html')));
        test.end();
    });

    test.test('security', function (test: Test) {
        for (let securityTest of securityTests) {
            let template = securityTest[0];
            let loader = new TwingLoaderFilesystem([nodePath.resolve('test/tests/unit/loader/fixtures')]);

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

    test.test('paths', function (test: Test) {
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

            // do not use realpath here as it would make the test unuseful
            test.same(loader.getCacheKey('@named/named_absolute.html'), cacheKey);
            test.same(loader.getSourceContext('index.html').getCode(), "path (final)\n",);
            test.same(loader.getSourceContext('@__main__/index.html').getCode(), "path (final)\n");
            test.same(loader.getSourceContext('@named/index.html').getCode(), "named path (final)\n");
        }

        test.end();
    });

    test.test('empty-constructor', function (test: Test) {
        let loader = new TwingLoaderFilesystem();
        test.same(loader.getPaths(), []);

        test.end();
    });

    test.test('get-namespaces', function (test: Test) {
        let loader = new TwingLoaderFilesystem(os.tmpdir());
        test.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE]);

        loader.addPath(os.tmpdir(), 'named');
        this.same(loader.getNamespaces(), [TwingLoaderFilesystem.MAIN_NAMESPACE, 'named']);

        test.end();
    });

    test.test('find-template-exception-namespace', function (test: Test) {
        let basePath = fixturesPath;

        let loader = new TwingLoaderFilesystem([nodePath.join(basePath, 'normal')]);
        loader.addPath(nodePath.join(basePath, 'named'), 'named');

        try {
            loader.getSourceContext('@named/nowhere.html');
        }
        catch (e) {
            test.same(e instanceof TwingErrorLoader, true);
            // @ts-ignore
            test.contains(e.message, 'Unable to find template "@named/nowhere.html"');
        }

        test.end();
    });

    test.test('find-template-with-cache', function (test: Test) {
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

    // test.test('load-template-and-render-block-with-cache', function (test: Test) {
    //     let loader = new TwingLoaderFilesystem([]);
    //     loader.addPath(nodePath.join(fixturesPath, 'themes/theme2'));
    //     loader.addPath(nodePath.join(fixturesPath, 'themes/theme1'));
    //     loader.addPath(nodePath.join(fixturesPath, 'themes/theme1'), 'default_theme');
    //
    //     let twing = new TwingEnvironment(loader);
    //
    //     let template = twing.loadTemplate('blocks.html.twig');
    //
    //     test.same(template.renderBlock('b1', {}), 'block from theme 1');
    //
    //     template = twing.loadTemplate('blocks.html.twig');
    //
    //     test.same(template.renderBlock('b2', {}), 'block from theme 2');
    //
    //     test.end();
    // });
    //
    // test.test('array-inheritance', function (test: Test) {
    //    for (let [testMessage, arrayInheritanceTest] of arrayInheritanceTests) {
    //        let templateName = arrayInheritanceTest[0];
    //        let loader = new TwingLoaderFilesystem([]);
    //        loader.addPath(nodePath.join(fixturesPath, 'inheritance'));
    //
    //        let twing = new TwingEnvironment(loader);
    //        let template = twing.loadTemplate(templateName);
    //
    //        test.same(template.renderBlock('body', {}), 'VALID Child', testMessage);
    //    }
    //
    //     test.end();
    // });

    test.end();
});