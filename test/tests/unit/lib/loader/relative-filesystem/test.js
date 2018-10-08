const {
    TwingLoaderRelativeFilesystem: TwingLoaderFilesystem,
    TwingErrorLoader,
    TwingSource,
    TwingEnvironment
} = require('../../../../../../build');

const tap = require('tape');
const nodePath = require('path');
const sinon = require('sinon');

let fixturesPath = nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures');

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
    test.test('getSourceContext', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve('test/tests/integration/fixtures', path);
        };

        let loader = new TwingLoaderFilesystem();

        try {
            loader.getSourceContext('errors/index.html');
        }
        catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "errors/index.html".`);
        }

        let source = loader.getSourceContext('errors/index.html', new TwingSource('', '', resolvePath('foo.html')));

        test.same(source.getName(), resolvePath('errors/index.html'));
        test.same(source.getPath(), source.getName());

        source = loader.getSourceContext('../errors/index.html', new TwingSource('', '', resolvePath('foo/bar.html')));

        test.same(source.getName(), resolvePath('errors/index.html'));
        test.same(source.getPath(), source.getName());

        try {
            loader.getSourceContext('foo', new TwingSource('', '', 'foo/bar/index.html'));
        }
        catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "foo/bar/foo".`);
        }

        test.test('use error cache on subsequent calls', function (test) {
            let validateNameSpy = sinon.spy(loader, 'validateName');

            try {
                loader.getSourceContext('foo', new TwingSource('', ''));
            }
            catch (e) {

            }

            try {
                loader.getSourceContext('foo', new TwingSource('', ''));
            }
            catch (e) {

            }

            test.same(validateNameSpy.callCount, 1);

            test.end();
        });

        test.end();
    });

    test.test('security', function (test) {
        for (let securityTest of securityTests) {
            let template = securityTest[0];
            let loader = new TwingLoaderFilesystem();

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

    test.test('findTemplate', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let CustomLoader = class extends TwingLoaderFilesystem {
            findTemplate(name, throw_) {
                return super.findTemplate(name, throw_);
            }
        };

        let loader = new CustomLoader();

        test.same(loader.findTemplate(resolvePath('named/index.html')), resolvePath('named/index.html'));
        test.same(loader.findTemplate(resolvePath('named'), false), null);

        try {
            loader.findTemplate(resolvePath('named'), true);
        }
        catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "${resolvePath('named')}".`);
        }

        test.test('find-template-with-error-cache', function (test) {
            loader.findTemplate('non-existing', false);

            let spy = sinon.spy(loader, 'validateName');

            test.same(loader.findTemplate('non-existing', false), null);
            test.same(spy.callCount, 0);

            spy.restore();

            test.end();
        });

        test.end();
    });

    test.test('find-template-with-cache', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let loader = new TwingLoaderFilesystem();
        let namedSource = loader.getSourceContext('named/index.html', new TwingSource('', '', resolvePath('index.html'))).getCode();

        test.same(namedSource, "named path\n");

        test.end();
    });

    test.test('load-template-and-render-block-with-cache', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let loader = new TwingLoaderFilesystem();

        let twing = new TwingEnvironment(loader);

        let template = twing.loadTemplate('../themes/theme1/blocks.html.twig', null, new TwingSource('', '', resolvePath('normal/index.html')));

        test.same(template.renderBlock('b1', {}), 'block from theme 1');

        template = twing.loadTemplate('../themes/theme3/blocks.html.twig', null, new TwingSource('', '', resolvePath('normal/index.html')));

        test.same(template.renderBlock('b2', {}), 'block from theme 3');

        test.end();
    });

    test.test('array-inheritance', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve(nodePath.join(fixturesPath, 'inheritance'), path);
        };

        for (let [testMessage, arrayInheritanceTest] of arrayInheritanceTests) {
            let templateName = resolvePath(arrayInheritanceTest[0]);
            let loader = new TwingLoaderFilesystem();
            let twing = new TwingEnvironment(loader);
            let template = twing.loadTemplate(templateName);

            test.same(template.renderBlock('body', {}), 'VALID Child', testMessage);
        }

        test.end();
    });

    test.test('should normalize template name', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve(fixturesPath, path);
        };

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
            test.same(loader.getSourceContext(name, new TwingSource('', '', resolvePath('foo.html'))), new TwingSource('named path\n', resolvePath('named/index.html'), resolvePath('named/index.html')));
        }

        test.end();
    });

    test.test('exists', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderFilesystem();
        let source = new TwingSource('', '', resolvePath('index.html'));

        test.equals(loader.exists('normal/index.html', source), true);
        test.equals(loader.exists('foo', source), false);

        loader.getSourceContext('normal/index.html', source);

        let spy = sinon.spy(loader, 'findTemplate');
        let exists = loader.exists('normal/index.html', source);

        test.equals(exists, true);
        test.same(spy.callCount, 0);

        exists = loader.exists('normal/index.html', null);

        test.equals(exists, false);

        test.end();
    });

    test.test('isFresh', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderFilesystem();
        let source = new TwingSource('', '', resolvePath('index.html'));

        test.true(loader.isFresh('normal/index.html', new Date().getTime(), source));

        test.end();
    });

    test.test('resolve', function (test) {
        let resolvePath = (path) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderFilesystem();
        let source = new TwingSource('', '', resolvePath('index.html'));

        test.same(loader.resolve('normal/index.html', source), resolvePath('normal/index.html'));
        test.same(loader.resolve(resolvePath('normal/index.html'), null), resolvePath('normal/index.html'));

        test.end();
    });

    test.end();
});
