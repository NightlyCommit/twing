const TwingTestMockEnvironment = require('../../../../mock/environment');
const {
    TwingEnvironment,
    TwingLoaderFilesystem,
    TwingCacheNull,
    TwingTemplate,
    TwingParser,
    TwingLexer,
    TwingErrorSyntax,
    TwingTemplateWrapper,
    TwingLoaderArray,
    TwingSource,
    TwingCacheFilesystem,
    TwingFilter,
    TwingFunction,
    TwingTest,
    TwingTokenParser,
    TwingExtension,
    TwingErrorRuntime
} = require('../../../../../dist');

const TwingTestMockRuntimeLoader = require('../../../../mock/runtime-loader');
const TwingTestMockLoader = require('../../../../mock/loader');
const TwingTestMockCache = require('../../../../mock/cache');
const TwingTestMockTemplate = require('../../../../mock/template');
const {SourceMapConsumer} = require('source-map');

const tap = require('tape');
const sinon = require('sinon');
const tmp = require('tmp');

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

        this.TwingExtensionGlobalsInterfaceImpl = {
            getGlobals: () => {
                return new Map([
                    ['foo_global', 'foo_global']
                ]);
            }
        };
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
        return new Map([
            [0, new TwingFilter('foo_filter')]
        ]);
    }

    getTests() {
        return [
            new TwingTest('foo_test'),
        ];
    }

    getFunctions() {
        return new Map([
            [0, new TwingFunction('foo_function')],
        ]);
    }

    getOperators() {
        return [
            new Map([
                ['foo_unary', {}]
            ]),
            new Map([
                ['foo_binary', {}]
            ])
        ];
    }
}

class TwingTestsEnvironmentTestExtensionRegression extends TwingTestsEnvironmentTestExtension {
    getFilters() {
        return [
            new TwingFilter('foo_filter')
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('foo_function')
        ];
    }
}

class TwingTestsEnvironmentTestExtensionWithDeprecationInitRuntime extends TwingExtension {
    constructor() {
        super();

        this.TwingExtensionInitRuntimeInterfaceImpl = {
            initRuntime(env) {
            }
        };
    }
}

class TwingTestsEnvironmentTestExtensionWithoutDeprecationInitRuntime extends TwingExtension {
    constructor() {
        super();

        this.TwingExtensionInitRuntimeInterfaceImpl = {
            initRuntime(env) {
            }
        };
    }
}

class TwingTestsEnvironmentTestExtensionWithoutRuntime extends TwingExtension {
    getFunctions() {
        return new Map([
            [0, new TwingFunction('from_runtime_array', ['TwingTestsEnvironmentTestRuntime', 'fromRuntime'])],
            [1, new TwingFunction('from_runtime_string', 'TwingTestsEnvironmentTestRuntime::fromRuntime')]
        ]);
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

class TwingTestsEnvironmentParserBar extends TwingParser {
    parse(stream, test, dropNeedle) {
        return 'bar';
    }
}

class TwingTestsEnvironmentLexerBar extends TwingLexer {
    tokenize(source) {
        return 'bar';
    }
}

class TwingTestsEnvironmentParserError extends TwingParser {
    parse(stream, test, dropNeedle) {
        throw new Error('Parser error "foo".');
    }
}

class TwingTestEnvironmentRuntimeLoaderNull {
    load(class_) {
        return null;
    }
}

function getMockLoader(templateName, templateContent) {
    let loader = new TwingTestMockLoader();

    sinon.stub(loader, 'getSourceContext').withArgs(templateName).returns(new TwingSource(templateContent, templateName));
    sinon.stub(loader, 'getCacheKey').withArgs(templateName).returns(templateName);

    return loader;
}

tap.test('environment', function (test) {
    test.test('autoescapeOption', function (test) {
        let loader = new TwingLoaderArray({
            'html': '{{ foo }} {{ foo }}',
            'js': '{{ bar }} {{ bar }}',
        });

        let twing = new TwingEnvironment(loader, {
            debug: true,
            cache: false,
            autoescape: escapingStrategyCallback
        });

        test.same(twing.render('html', {'foo': 'foo<br/ >'}), 'foo&lt;br/ &gt; foo&lt;br/ &gt;');
        test.same(twing.render('js', {'bar': 'foo<br/ >'}), 'foo\\u003Cbr\\/\\u0020\\u003E foo\\u003Cbr\\/\\u0020\\u003E');

        test.end();
    });

    test.test('globals', function (test) {
        let loader = new TwingTestMockLoader();
        sinon.stub(loader, 'getSourceContext').returns(new TwingSource('', ''));

        // globals can be added after calling getGlobals
        let twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.addGlobal('foo', 'bar');
        let globals = twing.getGlobals();
        test.same(globals.get('foo'), 'bar');

        // globals can be modified after a template has been loaded
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.loadTemplate('index');
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals.get('foo'), 'bar');

        // globals can be modified after extensions init
        twing = new TwingEnvironment(loader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals.get('foo'), 'bar');

        // globals can be modified after extensions and a template has been loaded
        let arrayLoader = new TwingLoaderArray({index: '{{foo}}'});
        twing = new TwingEnvironment(arrayLoader);
        twing.addGlobal('foo', 'foo');
        twing.getGlobals();
        twing.getFunctions();
        twing.loadTemplate('index');
        twing.addGlobal('foo', 'bar');
        globals = twing.getGlobals();
        test.same(globals.get('foo'), 'bar');

        twing = new TwingEnvironment(arrayLoader);
        twing.getGlobals();
        twing.addGlobal('foo', 'bar');
        let template = twing.loadTemplate('index');
        test.same(template.render({}), 'bar');

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

    test.test('testExtensionsAreNotInitializedWhenRenderingACompiledTemplate', function (test) {
        let cache = new TwingCacheFilesystem(tmp.dirSync().name);
        let options = {cache: cache, auto_reload: false, debug: false};

        // force compilation
        let loader = new TwingLoaderArray({index: '{{ foo }}'});
        let twing = new TwingEnvironment(loader, options);

        let key = cache.generateKey('index', twing.getTemplateClass('index'));
        cache.write(key, twing.compileSource(new TwingSource('{{ foo }}', 'index')));

        // check that extensions won't be initialized when rendering a template that is already in the cache
        twing = new TwingTestMockEnvironment(loader, options);
        twing['initExtensions'] = () => {
        };
        sinon.stub(twing, 'initExtensions');
        sinon.assert.notCalled(twing['initExtensions']);

        // render template
        let output = twing.render('index', {foo: 'bar'});
        test.same(output, 'bar');

        test.end();
    });

    test.test('autoReloadCacheMiss', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestMockEnvironment(loader, {cache: cache, auto_reload: true, debug: false});

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(0);
        let writeSpy = sinon.spy(cache, 'write');
        let loadSpy = sinon.spy(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate(templateName);

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);

        test.same(writeSpy.callCount, 1);
        test.same(loadSpy.callCount, 1);

        test.end();
    });

    test.test('autoReloadCacheHit', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestMockEnvironment(loader, {cache: cache, auto_reload: true, debug: false});

        let generateKeyStub = sinon.stub(cache, 'generateKey').returns('key');
        let getTimestampStub = sinon.stub(cache, 'getTimestamp').returns(0);
        let writeSpy = sinon.spy(cache, 'write');
        let loadSpy = sinon.spy(cache, 'load');
        let isFreshStub = sinon.stub(loader, 'isFresh').returns(true);

        twing.loadTemplate(templateName);

        test.same(generateKeyStub.callCount, 1, 'generateKey should be called once');
        test.same(getTimestampStub.callCount, 1, 'getTimestamp should be called once');
        test.same(isFreshStub.callCount, 1, 'isFresh should be called once');
        test.same(writeSpy.callCount, 0, 'write should not be called');
        test.true(loadSpy.callCount >= 1, 'load should be called at least once');

        test.end();
    });

    test.test('autoReloadOutdatedCacheHit', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingTestMockEnvironment(loader, {cache: cache, auto_reload: true, debug: false});

        let now = new Date();

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(now);
        let writeSpy = sinon.spy(cache, 'write');
        let loadSpy = sinon.spy(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate(templateName);

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);

        test.same(writeSpy.callCount, 1, 'write should be called once');
        test.same(loadSpy.callCount, 1, 'load should be called once');

        test.end();
    });

    test.test('sourceMapChangeCacheMiss', function (test) {
        let templateName = test.name;
        let templateContent = test.name;

        let cache = new TwingTestMockCache();
        let loader = getMockLoader(templateName, templateContent);
        let twing = new TwingEnvironment(loader, {
            cache: cache,
            source_map: true
        });

        let firstKey = null;
        let secondKey = null;

        sinon.stub(cache, 'generateKey').callsFake((name, className) => {
            return className;
        });
        sinon.stub(cache, 'load').callsFake((key) => {
            if (firstKey) {
                secondKey = key;
            }
            else {
                firstKey = key;
            }

            return () => {
                return {};
            }
        });

        twing.loadTemplate(templateName);

        twing = new TwingEnvironment(loader, {
            cache: cache,
            source_map: false
        });

        twing.loadTemplate(templateName);

        test.notEquals(firstKey, secondKey);

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
        test.true(twing.getGlobals().has('foo_global'));

        let visitors = twing.getNodeVisitors();
        let found = false;

        for (let visitor of visitors) {
            if (visitor instanceof TwingTestsEnvironmentTestNodeVisitor) {
                found = true;
            }
        }

        test.true(found);

        test.test('with explicit name', (test) => {
            let twing = new TwingEnvironment(new TwingTestMockLoader());
            let ext1 = new TwingTestsEnvironmentTestExtension();
            let ext2 = new TwingTestsEnvironmentTestExtension();

            twing.addExtension(ext1, 'ext1');
            twing.addExtension(ext2, 'ext2');

            test.equals(twing.getExtension('ext1'), ext1);
            test.equals(twing.getExtension('ext2'), ext2);

            test.end();
        });

        test.test('support pre-1.2.0 API', (test) => {
            let twing = new TwingEnvironment(new TwingTestMockLoader());
            let ext = new TwingTestsEnvironmentTestExtensionRegression();
            twing.addExtension(ext);

            test.true(twing.getFilters().has('foo_filter'));
            test.true(twing.getFunctions().has('foo_function'));

            test.end();
        });

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

    test.test('addRuntimeLoader', function (test) {
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

        test.same(twing.render('func_array'), 'foo');
        test.same(twing.render('func_array_default'), 'bar');
        test.same(twing.render('func_array_named_args'), 'foo');
        test.same(twing.render('func_string'), 'foo');
        test.same(twing.render('func_string_default'), 'bar');
        test.same(twing.render('func_string_named_args'), 'foo');

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

    test.test('baseTemplateClass', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader(), {
            base_template_class: 'Foo'
        });

        let templateClass = env.getTemplateClass('foo');

        env.setBaseTemplateClass('Bar');

        test.same(env.getBaseTemplateClass(), 'Bar');
        test.notSame(env.getTemplateClass('foo'), templateClass);

        test.end();
    });

    test.test('debug', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader(), {
            debug: false
        });

        let templateClass = env.getTemplateClass('foo');

        test.test('enable', function (test) {
            env.enableDebug();

            test.true(env.isDebug());
            test.notSame(env.getTemplateClass('foo'), templateClass);
            test.end();
        });

        test.test('disable', function (test) {
            env.disableDebug();

            test.false(env.isDebug());
            test.same(env.getTemplateClass('foo'), templateClass);
            test.end();
        });

        test.end();
    });

    test.test('autoreload', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader(), {
            auto_reload: false
        });

        test.test('enable', function (test) {
            env.enableAutoReload();

            test.true(env.isAutoReload());
            test.end();
        });

        test.test('disable', function (test) {
            env.disableAutoReload();

            test.false(env.isAutoReload());
            test.end();
        });


        test.end();
    });

    test.test('strict_variables', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader(), {
            strict_variables: false
        });

        let templateClass = env.getTemplateClass('foo');

        test.test('enable', function (test) {
            env.enableStrictVariables();

            test.true(env.isStrictVariables());
            test.notSame(env.getTemplateClass('foo'), templateClass);
            test.end();
        });

        test.test('disable', function (test) {
            env.disableStrictVariables();

            test.false(env.isStrictVariables());
            test.same(env.getTemplateClass('foo'), templateClass);
            test.end();
        });

        test.end();
    });

    test.test('cache', function (test) {
        test.test('set', function (test) {
            let env = new TwingEnvironment(new TwingTestMockLoader(), {
                cache: false
            });

            env.setCache('bar');

            test.same(env.getCache(), 'bar');
            test.true(env.getCache(false) instanceof TwingCacheFilesystem);

            env.setCache(new TwingTestMockCache());

            test.true(env.getCache(false) instanceof TwingTestMockCache);

            test.throws(function () {
                env.setCache({});
            }, new Error('Cache can only be a string, false, or a TwingCacheInterface implementation.'));

            test.end();
        });

        test.end();
    });

    test.test('display', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'bar'
        }));

        let data;
        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk) {
            data = chunk;

            process.stdout.write = originalWrite;

            test.same(data, 'bar');
            test.end();
        };

        env.display('index');
    });

    test.test('load', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'bar'
        }));

        let template = new TwingTestMockTemplate();
        let templateWrapper = new TwingTemplateWrapper(env, template);

        test.true(env.load(template) instanceof TwingTemplateWrapper);
        test.same(env.load(templateWrapper), templateWrapper);
        test.true(env.load('index') instanceof TwingTemplateWrapper);

        test.end();
    });

    test.test('loadTemplate', function (test) {
        let env = new TwingTestMockEnvironment(new TwingLoaderArray({index: 'foo'}), {
            cache: new TwingTestMockCache()
        });

        let template = env.loadTemplate('index');

        test.true(template instanceof TwingTestMockTemplate);

        test.end();
    });

    test.test('resolveTemplate', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: '{{ foo'
        }));

        let template = new TwingTestMockTemplate();
        let templateWrapper = new TwingTemplateWrapper(env, template);

        test.same(env.resolveTemplate(templateWrapper), templateWrapper);

        test.throws(function () {
            env.resolveTemplate('index');
        }, new TwingErrorSyntax('Unexpected token "end of template" of value "null" ("end of print statement" expected).', 1, new TwingSource('{{ foo', 'index', '')));

        test.throws(function () {
            env.resolveTemplate('missing');
        }, new Error('Template "missing" is not defined.'));

        test.end();
    });

    test.test('parser', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        env.setParser(new TwingTestsEnvironmentParserBar(env));

        test.same(env.parse(env.tokenize(new TwingSource('foo', 'index', ''))), 'bar');

        test.end();
    });

    test.test('lexer', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        env.setLexer(new TwingTestsEnvironmentLexerBar(env));

        test.same(env.tokenize(new TwingSource('foo', 'index', '')), 'bar');

        test.end();
    });

    test.test('compileSource', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        let source = new TwingSource('{{ foo', 'index', '');

        test.throws(function () {
            env.compileSource(source);
        }, new TwingErrorSyntax('Unexpected token "end of template" of value "null" ("end of print statement" expected).', 1, source));

        env.setParser(new TwingTestsEnvironmentParserError(env));
        source = new TwingSource('{{ foo.bar }}', 'index', '');

        test.throws(function () {
            env.compileSource(source);
        }, new TwingErrorSyntax('An exception has been thrown during the compilation of a template ("Parser error "foo".").', -1, source, new Error('Parser error "foo"')));

        test.end();
    });

    test.test('getRuntime', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        env.addRuntimeLoader(new TwingTestEnvironmentRuntimeLoaderNull());

        test.throws(function () {
            env.getRuntime('Foo');
        }, new TwingErrorRuntime('Unable to load the "Foo" runtime.'));

        test.end();
    });

    test.test('extensions', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        let extension = new TwingTestsEnvironmentTestExtension();

        env.setExtensions([extension]);

        test.true(env.getExtensions().has('TwingTestsEnvironmentTestExtension'));

        test.end();
    });

    test.test('nodeVisitors', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        let nodeVisitor = new TwingTestsEnvironmentTestNodeVisitor();

        env.addNodeVisitor(nodeVisitor);

        test.true(env.getNodeVisitors().includes(nodeVisitor));

        test.end();
    });

    test.test('undefinedFilterCallbacks', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        let fakeFilter = {};

        let cb = (name) => {
            return fakeFilter;
        };

        env.registerUndefinedFilterCallback(cb);

        test.same(env.getFilter('fake'), fakeFilter);

        test.end();
    });

    test.test('undefinedFunctionCallbacks', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: 'foo'
        }));

        let fakeFunction = {};

        let cb = (name) => {
            return fakeFunction;
        };

        env.registerUndefinedFunctionCallback(cb);

        test.same(env.getFunction('fake'), fakeFunction);

        test.end();
    });

    test.test('should emit events', (test) => {
        test.test('template', (test) => {
            let env = new TwingEnvironment(new TwingLoaderArray({
                index: '{% include "foo" %}',
                foo: 'Foo'
            }));

            let templates = [];

            env.on('template', (name) => {
                templates.push(name);
            });

            env.render('index');

            test.same(templates, [
                'index',
                'foo'
            ]);

            test.end();
        });

        test.end();
    });

    test.test('source map support', (test) => {
        let fixturesPath = 'test/tests/unit/lib/environment/fixtures/css';

        let loader = new TwingLoaderFilesystem(fixturesPath);
        loader.addPath(fixturesPath, 'Css');

        let indexSource = fixturesPath + '/index.css.twig';
        let colorSource = fixturesPath + '/partial/color.css.twig';
        let backgroundSource = fixturesPath + '/partial/background.css.twig';

        test.test('when source_map is set to true', (test) => {
            let env = new TwingEnvironment(loader, {
                source_map: true
            });

            // 1.foo {
            // 2    text-align: right;
            // 3    color: whitesmoke;
            // 4    background-color: brown;
            // 5    background-image: url("foo.png");
            // 6    display: block;
            // 7}

            env.render('index.css.twig', {
                align: 'right'
            });

            let map = env.getSourceMap();

            let consumer = SourceMapConsumer.fromSourceMap(map);
            let mappings = [];

            consumer.eachMapping((mapping) => {
                mappings.push(mapping);
            });

            test.same(
                mappings,
                [
                    {
                        source: indexSource,
                        generatedLine: 1,
                        generatedColumn: 0,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: indexSource,
                        generatedLine: 1,
                        generatedColumn: 0,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 2,
                        generatedColumn: 16,
                        originalLine: 2,
                        originalColumn: 16,
                        name: 'print'
                    },
                    {
                        source: indexSource,
                        generatedLine: 2,
                        generatedColumn: 21,
                        originalLine: 2,
                        originalColumn: 27,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 3,
                        originalColumn: 14,
                        name: 'include'
                    },
                    {
                        source: colorSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: colorSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 3,
                        generatedColumn: 21,
                        originalLine: 3,
                        originalColumn: 49,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 4,
                        originalColumn: 7,
                        name: 'include'
                    },
                    {
                        source: backgroundSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: backgroundSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 6,
                        generatedColumn: 0,
                        originalLine: 5,
                        originalColumn: 0,
                        name: 'text'
                    }
                ]
            );

            test.end();
        });

        test.test('when source_map is set to false', (test) => {
            let env = new TwingEnvironment(loader, {
                source_map: false
            });

            env.render('index.css.twig', {
                align: 'right'
            });

            let map = env.getSourceMap();

            test.equals(map, null);

            test.end();
        });

        test.test('when source_map is a string', (test) => {
            let env = new TwingEnvironment(loader, {
                source_map: 'foo'
            });

            // 1.foo {
            // 2    text-align: right;
            // 3    color: whitesmoke;
            // 4    background-color: brown;
            // 5    background-image: url("foo.png");
            // 6    display: block;
            // 7}

            env.render('index.css.twig', {
                align: 'right'
            });

            let map = env.getSourceMap();

            let consumer = SourceMapConsumer.fromSourceMap(map);

            let mappings = [];

            consumer.eachMapping((mapping) => {
                mappings.push(mapping);
            });

            indexSource = 'foo/' + indexSource;
            colorSource = 'foo/' + colorSource;
            backgroundSource = 'foo/' + backgroundSource;

            test.same(
                mappings,
                [
                    {
                        source: indexSource,
                        generatedLine: 1,
                        generatedColumn: 0,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: indexSource,
                        generatedLine: 1,
                        generatedColumn: 0,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 2,
                        generatedColumn: 16,
                        originalLine: 2,
                        originalColumn: 16,
                        name: 'print'
                    },
                    {
                        source: indexSource,
                        generatedLine: 2,
                        generatedColumn: 21,
                        originalLine: 2,
                        originalColumn: 27,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 3,
                        originalColumn: 14,
                        name: 'include'
                    },
                    {
                        source: colorSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: colorSource,
                        generatedLine: 3,
                        generatedColumn: 11,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 3,
                        generatedColumn: 21,
                        originalLine: 3,
                        originalColumn: 49,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 4,
                        originalColumn: 7,
                        name: 'include'
                    },
                    {
                        source: backgroundSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'module'
                    },
                    {
                        source: backgroundSource,
                        generatedLine: 4,
                        generatedColumn: 4,
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        source: indexSource,
                        generatedLine: 6,
                        generatedColumn: 0,
                        originalLine: 5,
                        originalColumn: 0,
                        name: 'text'
                    }
                ]
            );

            test.end();
        });

        test.test('handle templates compiled without source map support', (test) => {
            class CustomTemplate extends TwingTemplate {
                getTemplateName() {
                    return 'foo';
                }

                doDisplay() {

                }
            }

            class CustomCache extends TwingCacheNull {
                generateKey(name, className) {
                    return className;
                }

                load(key) {
                    let obj = {};

                    obj[key] = CustomTemplate;

                    return () => {
                        return obj;
                    };
                }
            }

            let env = new TwingEnvironment(loader, {
                source_map: true,
                cache: new CustomCache()
            });

            env.render('index.css.twig');

            let sourceMap = env.getSourceMap();

            test.false(sourceMap);
            test.end();
        });

        test.end();
    });

    test.test('version', (test) => {
        test.comment('VERSION SUPPORT');


        test.end();
    });

    test.end();
});
