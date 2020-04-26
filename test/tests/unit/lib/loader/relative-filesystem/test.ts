import * as tape from 'tape';
import {TwingLoaderRelativeFilesystem} from "../../../../../../src/lib/loader/relative-filesystem";
import {TwingErrorLoader} from "../../../../../../src/lib/error/loader";
import {TwingSource} from "../../../../../../src/lib/source";

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

tape('loader filesystem', (test) => {
    test.test('getSourceContext', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve('test/tests/integration/fixtures', path);
        };

        let loader = new TwingLoaderRelativeFilesystem();

        try {
            await loader.getSourceContext('errors/index.html', null);
        } catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "errors/index.html".`);
        }

        let source = await loader.getSourceContext('errors/index.html', new TwingSource('', resolvePath('foo.html')));

        test.same(source.getName(), 'errors/index.html');
        test.same(source.getResolvedName(), resolvePath('errors/index.html'));

        source = await loader.getSourceContext('../errors/index.html', new TwingSource('', resolvePath('foo/bar.html')));

        test.same(source.getName(), '../errors/index.html');
        test.same(source.getResolvedName(), resolvePath('errors/index.html'));

        try {
            await loader.getSourceContext('foo', new TwingSource('', 'foo/bar/index.html'));
        } catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "foo/bar/foo" in "foo/bar/index.html".`);
        }

        test.test('use error cache on subsequent calls', async (test) => {
            let validateNameSpy = sinon.spy(loader, 'validateName');

            try {
                await loader.getSourceContext('foo', new TwingSource('', ''));
            } catch (e) {

            }

            try {
                await loader.getSourceContext('foo', new TwingSource('', ''));
            } catch (e) {

            }

            test.same(validateNameSpy.callCount, 1);

            test.end();
        });

        test.end();
    });

    test.test('security', async (test) => {
        for (let securityTest of securityTests) {
            let template = securityTest[0];
            let loader = new TwingLoaderRelativeFilesystem();

            try {
                await loader.getCacheKey(template, null);

                test.fail();
            } catch (e) {
                test.notSame(e.message, 'Unable to find template', e.message);
            }
        }

        test.end();
    });

    test.test('findTemplate', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let CustomLoader = class extends TwingLoaderRelativeFilesystem {
            findTemplate(name: string, throw_: boolean, from: TwingSource) {
                return super.findTemplate(name, throw_, from);
            }
        };

        let loader = new CustomLoader();

        test.same(await loader.findTemplate(resolvePath('named/index.html'), false, undefined), resolvePath('named/index.html'));
        test.same(await loader.findTemplate(resolvePath('named'), false, undefined), null);

        try {
            await loader.findTemplate(resolvePath('named'), undefined, undefined);
        } catch (err) {
            test.true(err instanceof TwingErrorLoader);
            test.same(err.getMessage(), `Unable to find template "${resolvePath('named')}".`);
        }

        test.test('find-template-with-error-cache', async (test) => {
            await loader.findTemplate('non-existing', false, null);

            let spy = sinon.spy(loader, 'validateName');

            test.same(await loader.findTemplate('non-existing', false, null), null);
            test.same(spy.callCount, 0);

            spy.restore();

            test.end();
        });

        test.test('with from defined', async (test) => {
            test.same(await loader.resolve('partial.html.twig', new TwingSource('', 'index.html.twig', 'test/tests/unit/lib/loader/relative-filesystem/fixtures/index.html.twig')), nodePath.resolve('test/tests/unit/lib/loader/relative-filesystem/fixtures/partial.html.twig'));

            test.end();
        });

        test.end();
    });

    test.test('find-template-with-cache', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let loader = new TwingLoaderRelativeFilesystem();
        let namedSource = (await loader.getSourceContext('named/index.html', new TwingSource('', resolvePath('index.html')))).getCode();

        test.same(namedSource, "named path\n");

        test.end();
    });

    test.test('should normalize template name', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve(fixturesPath, path);
        };

        let loader = new TwingLoaderRelativeFilesystem();

        let names = [
            ['named/index.html', 'named/index.html'],
            ['named//index.html', 'named/index.html'],
            ['named///index.html', 'named/index.html'],
            ['../fixtures/named/index.html', '../fixtures/named/index.html'],
            ['..//fixtures//named//index.html', '../fixtures/named/index.html'],
            ['..///fixtures///named///index.html', '../fixtures/named/index.html'],
            ['named\\index.html', 'named/index.html'],
            ['named\\\\index.html', 'named/index.html'],
            ['named\\\\\\index.html', 'named/index.html'],
            ['..\\fixtures\\named\\index.html', '../fixtures/named/index.html'],
            ['..\\\\fixtures\\\\named\\\\index.html', '../fixtures/named/index.html'],
            ['..\\\\\\fixtures\\named\\\\\\index.html', '../fixtures/named/index.html']
        ];

        for (let [name, expected] of names) {
            test.same(await loader.getSourceContext(name, new TwingSource('', resolvePath('foo.html'))), new TwingSource('named path\n', name, resolvePath(expected)));
        }

        try {
            await loader.getSourceContext(null, null);

            test.fail();
        } catch (e) {
            test.true(e.message.startsWith('Unable to find template ""'));
        }

        test.end();
    });

    test.test('exists', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderRelativeFilesystem();
        let source = new TwingSource('', resolvePath('index.html'));

        test.equals(await loader.exists('normal/index.html', source), true);
        test.equals(await loader.exists('foo', source), false);

        await loader.getSourceContext('normal/index.html', source);

        let spy = sinon.spy(loader, 'findTemplate');
        let exists = await loader.exists('normal/index.html', source);

        test.equals(exists, true);
        test.same(spy.callCount, 0);

        test.equals(await loader.exists('normal/index.html', null), false);
        test.equals(await loader.exists("foo\0.twig", source), false);
        test.equals(await loader.exists('@foo', source), false);
        test.equals(await loader.exists('foo', source), false);
        test.equals(await loader.exists('@foo/bar.twig', source), false);

        test.end();
    });

    test.test('isFresh', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderRelativeFilesystem();
        let source = new TwingSource('', resolvePath('index.html'));

        test.true(await loader.isFresh('normal/index.html', new Date().getTime(), source));

        test.end();
    });

    test.test('resolve', async (test) => {
        let resolvePath = (path: string) => {
            return nodePath.resolve('test/tests/unit/lib/loader/filesystem/fixtures', path);
        };

        let loader = new TwingLoaderRelativeFilesystem();
        let source = new TwingSource('', resolvePath('index.html'));

        test.same(await loader.resolve('normal/index.html', source), resolvePath('normal/index.html'));
        test.same(await loader.resolve(resolvePath('normal/index.html'), null), resolvePath('normal/index.html'));

        test.end();
    });

    test.test('getCacheKey', async (test) => {
        let loader = new TwingLoaderRelativeFilesystem();
        let resolvePath = (path: string) => {
            return nodePath.resolve('test/tests/unit/lib/loader/relative-filesystem/fixtures', path);
        };

        let source = new TwingSource('', resolvePath('index.html'));

        let key1 = loader.getCacheKey('partial.html.twig', source);
        let key2 = loader.getCacheKey('../fixtures/partial.html.twig', source);

        test.same(key1, key2);

        test.end();
    });

    test.end();
});
