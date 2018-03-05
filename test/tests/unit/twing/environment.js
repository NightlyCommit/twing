const TwingTestEnvironmentStub = require('../../../mock/environment');
const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingSource = require('../../../../lib/twing/source').TwingSource;
const TwingCacheFilesystem = require('../../../../lib/twing/cache/filesystem').TwingCacheFilesystem;
const TwingFilter = require('../../../../lib/twing/filter').TwingFilter;
const TwingFunction = require('../../../../lib/twing/function').TwingFunction;
const TwingTest = require('../../../../lib/twing/test').TwingTest;
const TwingTokenParser = require('../../../../lib/twing/token-parser').TwingTokenParser;
const TwingExtension = require('../../../../lib/twing/extension').TwingExtension;
const TwingTestMockRuntimeLoader = require('../../../mock/runtime-loader');
const TwingErrorRuntime = require('../../../../lib/twing/error/runtime').TwingErrorRuntime;
const TwingTestMockLoader = require('../../../mock/loader');
const TwingTestMockCache = require('../../../mock/cache');

const path = require('path');
const tap = require('tap');
const sinon = require('sinon');
const tmp = require('tmp');
const testdouble = require('testdouble');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

function escapingStrategyCallback(name) {
    return name;
}

class TwingTestsEnvironmentTestTokenParser extends TwingTokenParser {
    parse(token) {
    }

    getTag() {
        return 'test';
    }
}

class TwingTestsEnvironmentTestNodeVisitor {
    enterNode(node, env) {
        return node;
    }

    leaveNode(node, env) {
        return node;
    }

    getPriority() {
        return 0;
    }
}

class TwingTestsEnvironmentTestExtension extends TwingExtension {
    constructor() {
        super();

        this.implementsTwingExtensionGlobalsInterface = true;
    }

    getTokenParsers() {
        return [
            new TwingTestsEnvironmentTestTokenParser(),
        ];
    }

    getNodeVisitors() {
        return [
            new TwingTestsEnvironmentTestNodeVisitor(),
        ];
    }

    getFilters() {
        return [
            new TwingFilter('foo_filter')
        ];
    }

    getTests() {
        return [
            new TwingTest('foo_test'),
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('foo_function'),
        ];
    }

    getOperators() {
        return {
            unary: new Map([
                ['foo_unary', {}]
            ]),
            binary: new Map([
                ['foo_binary', {}]
            ])
        };
    }

    getGlobals() {
        return {
            foo_global: 'foo_global'
        };
    }
}

class TwingTestsEnvironmentTestExtensionWithDeprecationInitRuntime extends TwingExtension {
    initRuntime(env) {
    }
}

class TwingTestsEnvironmentTestExtensionWithoutDeprecationInitRuntime extends TwingExtension {
    constructor() {
        super();

        this.implementsTwingExtensionInitRuntimeInterface = true;
    }

    initRuntime(env) {
    }
}

class TwingTestsEnvironmentTestExtensionWithoutRuntime extends TwingExtension {
    getFunctions() {
        return [
            new TwingFunction('from_runtime_array', ['TwingTestsEnvironmentTestRuntime', 'fromRuntime']),
            new TwingFunction('from_runtime_string', 'TwingTestsEnvironmentTestRuntime::fromRuntime')
        ];
    }

    getName() {
        return 'from_runtime';
    }
}

class TwingTestsEnvironmentTestRuntime {
    fromRuntime(name = 'bar') {
        return name;
    }
}

function getMockLoader(templateName, templateContent) {
    let loader = new TwingTestMockLoader();

    sinon.stub(loader, 'getSourceContext').withArgs(templateName).returns(new TwingSource(templateContent, templateName));
    sinon.stub(loader, 'getCacheKey').withArgs(templateName).returns(templateName);

    return loader;
}

tap.test('environment', function (test) {
    test.test('autoescapeOption', async function (test) {
        let loader = new TwingLoaderArray({
            'html': '{{ foo }} {{ foo }}',
            'js': '{{ bar }} {{ bar }}',
        });

        let twing = new TwingEnvironment(loader, {
            debug: true,
            cache: false,
            autoescape: escapingStrategyCallback
        });

        test.same(await twing.render('html', {'foo': 'foo<br/ >'}), 'foo&lt;br/ &gt; foo&lt;br/ &gt;');
        test.same(await twing.render('js', {'bar': 'foo<br/ >'}), 'foo\\x3Cbr\\x2F\\x20\\x3E foo\\x3Cbr\\x2F\\x20\\x3E');

        test.end();
    });

    test.test('globals', async function (test) {
        let loader = new TwingTestMockLoader();
        sinon.stub(loader, 'getSourceContext').returns(new TwingSource('', ''));

        // globals can be added after calling getGlobals
        let twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.addGlobal('foo', 'bar');
        let globals = twing.getGlobals();
        test.same(globals['foo'], 'bar');

        // globals can be modified after a template has been loaded
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.loadTemplate('index');
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals['foo'], 'bar');

        // globals can be modified after extensions init
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals['foo'], 'bar');

        // globals can be modified after extensions and a template has been loaded
        let arrayLoader = new TwingLoaderArray({index: '{{foo}}'});
        twing = new TwingEnvironment(arrayLoader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        twing.loadTemplate('index');
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals['foo'], 'bar');

        twing = new TwingEnvironment(arrayLoader);
        twing.getGlobals();
        twing.addGlobal('foo', 'bar');
        let template = twing.loadTemplate('index');
        test.same(await template.render({}), 'bar');

        // globals cannot be added after a template has been loaded
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.addGlobal('foo', 'bar');
        twing.loadTemplate('index');
        try {
            twing.addGlobal('bar', 'bar');
            test.fail();
        }
        catch (e) {
            test.false(twing.getGlobals()['bar']);
        }

        // globals cannot be added after extensions init
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        try {
            twing.addGlobal('bar', 'bar');
            test.fail();
        }
        catch (e) {
            test.false(twing.getGlobals()['bar']);
        }

        // globals cannot be added after extensions and a template has been loaded
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        twing.loadTemplate('index');
        try {
            twing.addGlobal('bar', 'bar');
            test.fail();
        }
        catch (e) {
            test.false(twing.getGlobals()['bar']);
        }

        // test adding globals after a template has been loaded without call to getGlobals
        twing = new TwingEnvironment(loader);
        twing.loadTemplate('index');
        try {
            twing.addGlobal('bar', 'bar');
            test.fail();
        }
        catch (e) {
            test.false(twing.getGlobals()['bar']);
        }

        test.end();
    });

    test.test('testExtensionsAreNotInitializedWhenRenderingACompiledTemplate', async function (test) {
        let cache = new TwingCacheFilesystem(tmp.dirSync().name);
        let options = {cache: cache, auto_reload: false, debug: false};

        // force compilation
        let loader = new TwingLoaderArray({index: '{{ foo }}'});
        let twing = new TwingEnvironment(loader, options);

        let key = cache.generateKey('index', twing.getTemplateClass('index'));
        cache.write(key, twing.compileSource(new TwingSource('{{ foo }}', 'index')));

        // check that extensions won't be initialized when rendering a template that is already in the cache
        twing = new TwingTestEnvironmentStub(loader, options);
        twing['initExtensions'] = () => {
        };
        sinon.stub(twing, 'initExtensions');
        sinon.assert.notCalled(twing['initExtensions']);

        // render template
        let output = await twing.render('index', {foo: 'bar'});
        test.same(output, 'bar');

        test.end();
    });

    test.test('autoReloadCacheMiss', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(0);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate(templateName);

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledOnce(cache['load']);

        test.end();
    });

    test.test('autoReloadCacheHit', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(0);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(true);

        twing.loadTemplate(templateName);

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledTwice(cache['load']);

        test.end();
    });

    test.test('autoReloadOutdatedCacheHit', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        let now = new Date();

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(now);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate(templateName);

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledOnce(cache['load']);

        test.end();
    });

    test.test('hasGetExtensionByClassName', function (test) {
        let twing = new TwingEnvironment(new TwingTestMockLoader());
        let ext = new TwingTestsEnvironmentTestExtension();
        twing.addExtension(ext);

        test.true(twing.hasExtension('TwingTestsEnvironmentTestExtension'));
        test.same(twing.getExtension('TwingTestsEnvironmentTestExtension'), ext);

        test.end();
    });

    test.test('addExtension', function (test) {
        let twing = new TwingEnvironment(new TwingTestMockLoader());
        let ext = new TwingTestsEnvironmentTestExtension();
        twing.addExtension(ext);

        test.true(twing.getTags().has('test'));
        test.true(twing.getFilters().has('foo_filter'));
        test.true(twing.getFunctions().has('foo_function'));
        test.true(twing.getTests().has('foo_test'));
        test.true(twing.getUnaryOperators().has('foo_unary'));
        test.true(twing.getBinaryOperators().has('foo_binary'));
        test.true(twing.getGlobals()['foo_global']);

        let visitors = twing.getNodeVisitors();
        let found = false;

        for (let visitor of visitors) {
            if (visitor instanceof TwingTestsEnvironmentTestNodeVisitor) {
                found = true;
            }
        }

        test.true(found);

        test.end();
    });

    test.test('addMockExtension', function (test) {
        let extension = sinon.mock(TwingExtension).object;

        let loader = new TwingLoaderArray({page: 'hey'});

        let twing = new TwingEnvironment(loader);
        twing.addExtension(extension);

        test.same(twing.getExtension(extension.constructor.name).name, 'TwingExtension');
        test.true(twing.isTemplateFresh('page', new Date().getTime()));

        test.end();
    });

    test.test('initRuntimeWithAnExtensionUsingInitRuntimeNoDeprecation', function (test) {
        let loader = new TwingLoaderArray({});
        let twing = new TwingEnvironment(loader);

        sinon.stub(loader, 'getCacheKey').returns('');
        sinon.stub(loader, 'getSourceContext').returns(new TwingSource('', ''));

        twing.addExtension(new TwingTestsEnvironmentTestExtensionWithoutDeprecationInitRuntime());

        twing.loadTemplate('');

        sinon.assert.calledOnce(loader['getSourceContext']);

        // add a dummy assertion here, the only thing we want to test is that the code above
        // can be executed without throwing any deprecations
        test.pass();
        test.end();
    });

    test.test('overrideExtension', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({}));

        twing.addExtension(new TwingTestsEnvironmentTestExtension());

        test.throws(function () {
            twing.addExtension(new TwingTestsEnvironmentTestExtension());
        }, new Error('Unable to register extension "TwingTestsEnvironmentTestExtension" as it is already registered.'));

        test.end();
    });

    test.test('addRuntimeLoader', async function (test) {
        let runtimeLoader = new TwingTestMockRuntimeLoader();

        sinon.stub(runtimeLoader, 'load').returns(new TwingTestsEnvironmentTestRuntime());

        let loader = new TwingLoaderArray({
            func_array: '{{ from_runtime_array("foo") }}',
            func_array_default: '{{ from_runtime_array() }}',
            func_array_named_args: '{{ from_runtime_array(name="foo") }}',
            func_string: '{{ from_runtime_string("foo") }}',
            func_string_default: '{{ from_runtime_string() }}',
            func_string_named_args: '{{ from_runtime_string(name="foo") }}'
        });

        let twing = new TwingEnvironment(loader, {cache: false});
        twing.addExtension(new TwingTestsEnvironmentTestExtensionWithoutRuntime());
        twing.addRuntimeLoader(runtimeLoader);

        test.same(await twing.render('func_array'), 'foo');
        test.same(await twing.render('func_array_default'), 'bar');
        test.same(await twing.render('func_array_named_args'), 'foo');
        test.same(await twing.render('func_string'), 'foo');
        test.same(await twing.render('func_string_default'), 'bar');
        test.same(await twing.render('func_string_named_args'), 'foo');

        sinon.assert.called(runtimeLoader.load);

        test.end();
    });

    test.test('failLoadTemplate', function (test) {
        let template = 'testFailLoadTemplate.twig';
        let twing = new TwingEnvironment(new TwingLoaderArray({'testFailLoadTemplate.twig': false}));

        test.throws(function () {
            twing.loadTemplate(template, 'abc');
        }, new TwingErrorRuntime('Failed to load Twig template "testFailLoadTemplate.twig", index "abc": cache is corrupted.', -1, new TwingSource(false, 'testFailLoadTemplate.twig')));

        test.end();
    });

    test.test('failLoadTemplateOnCircularReference', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({'base.html.twig': '{% extends "base.html.twig" %}'}), {
            cache: false
        });

        test.throws(function () {
            twing.loadTemplate('base.html.twig');
        }, new TwingErrorRuntime('Circular reference detected for Twig template "base.html.twig", path: base.html.twig -> base.html.twig.', 1, new TwingSource('', 'base.html.twig', '')));

        test.end();
    });

    test.test('failLoadTemplateOnComplexCircularReference', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'base1.html.twig': '{% extends "base2.html.twig" %}',
            'base2.html.twig': '{% extends "base1.html.twig" %}'
        }), {
            cache: false
        });

        test.throws(function () {
            twing.loadTemplate('base1.html.twig');
        }, new TwingErrorRuntime('Circular reference detected for Twig template "base1.html.twig", path: base1.html.twig -> base2.html.twig -> base1.html.twig.', 1, new TwingSource('', 'base1.html.twig', '')));

        test.end();
    });

    test.end();
});
