const {TwingLoaderArray} = require('../../../../build/loader/array');
const {TwingTemplate} = require('../../../../build/template');
const {TwingEnvironment} = require('../../../../build/environment');
const {TwingSource} = require('../../../../build/source');
const {TwingErrorRuntime} = require('../../../../build/error/runtime');
const {TwingOutputBuffering} = require('../../../../build/output-buffering');
const {TwingErrorLoader} = require('../../../../build/error/loader');
const {TwingLoaderChain} = require('../../../../build/loader/chain');

const test = require('tape');
const sinon = require('sinon');

class TwingTestTemplateTemplate extends TwingTemplate {
    constructor(strictVariables = true) {
        super(new TwingEnvironment(new TwingLoaderArray({
            foo: '{% block foo %}foo{% endblock %}'
        }), {
            strict_variables: strictVariables
        }));
    }

    doDisplay(context, blocks) {
        TwingOutputBuffering.echo('foo');
    }

    /**
     * @return Function
     */
    getPublicGetAttribute() {
        return this.getAttribute.bind(this);
    }
}

class TwingTestTemplateTemplateWithInvalidLoadTemplate extends TwingTemplate {
    constructor() {
        super(new TwingEnvironment(new TwingLoaderChain([
            new TwingLoaderArray({})
        ])));
    }

    getTemplateName() {
        return 'foo';
    }

    doDisplay(context, blocks) {
        this.loadTemplate('not_found', 'foo');
    }

    getSourceContext() {
        return new TwingSource('code', 'foo', 'path');
    }
}

test('template', function (test) {
    test.test('toString', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.toString(), template.getTemplateName());

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let template = new TwingTestTemplateTemplate();

        Reflect.set(template, 'sourceCode', '');
        Reflect.set(template, 'sourceName', 'foo');
        Reflect.set(template, 'sourcePath', '');

        test.same(template.getSourceContext(), new TwingSource('', 'foo', ''));

        test.end();
    });

    test.test('getParent', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'doGetParent');

        stub.returns(false);

        test.same(template.getParent(), false);

        stub.returns('foo');

        test.true(template.getParent() instanceof TwingTemplate);

        stub.returns('bar');

        test.throws(function () {
            template.getParent();
        });

        stub.throws();

        test.throws(function () {
            template.getParent();
        });

        test.end();
    });

    test.test('displayParentBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'getParent');

        Reflect.set(template, 'sourceCode', '');
        Reflect.set(template, 'sourceName', 'foo');
        Reflect.set(template, 'sourcePath', '');

        stub.returns(false);

        test.throws(function () {
            template.displayParentBlock('foo', {});
        });

        test.end();
    });

    test.test('displayBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'getParent');

        Reflect.set(template, 'sourceCode', '');
        Reflect.set(template, 'sourceName', 'foo');
        Reflect.set(template, 'sourcePath', '');

        stub.returns(false);

        try {
            template.displayBlock('foo', {});
        }
        catch (e) {
            test.true(e instanceof TwingErrorRuntime);
            test.same(e.rawMessage, 'Block "foo" on template "foo" does not exist.')
        }

        test.end();
    });

    test.test('renderParentBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'doGetParent');

        stub.returns('foo');

        test.same(template.renderParentBlock('foo', {}, new Map()), 'foo');
        test.same(template.renderParentBlock('foo', {}), 'foo');

        test.end();
    });

    test.test('loadTemplate', function (test) {
        let template = new TwingTestTemplateTemplate();

        template.env = null;

        try {
            template.loadTemplate('foo');

            test.fail('should throw an Error');
        }
        catch (e) {
            test.true(e instanceof Error);
            test.same(e.message, 'Cannot read property \'loadTemplate\' of null')
        }

        test.test('should return an error with full source information when templateName is set', (test) => {
            let template = new TwingTestTemplateTemplateWithInvalidLoadTemplate();

            try {
                template.display({});

                test.fail('should throw an Error');
            }
            catch (e) {
                test.true(e instanceof TwingErrorLoader);
                test.same(e.message, 'Template "not_found" is not defined in "foo".');
                test.same(e.getSourceContext(), new TwingSource('code', 'foo', 'path'));
            }

            test.end();
        });

        test.end();
    });

    test.test('doGetParent', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.equals(template.doGetParent('foo'), false);

        test.end();
    });

    test.test('displayWithErrorHandling', function (test) {
        let template = new TwingTestTemplateTemplate();

        Reflect.set(template, 'sourceCode', '');
        Reflect.set(template, 'sourceName', 'foo');
        Reflect.set(template, 'sourcePath', '');

        TwingOutputBuffering.obStart();
        template.displayWithErrorHandling({});
        let content = TwingOutputBuffering.obGetContents();

        test.same(content, 'foo');

        test.test('should rethrow native error as TwingErrorRuntime', (test) => {
            sinon.stub(template, 'doDisplay').callsFake(() => {
                throw new Error('foo error');
            });

            try {
                template.displayWithErrorHandling({});

                test.fail();
            }
            catch (e) {
                test.same(e.name, 'TwingErrorRuntime');
                test.same(e.message, 'An exception has been thrown during the rendering of a template ("foo error") in "foo".');
            }

            test.end();
        });

        test.end();
    });

    test.test('traceableMethod', function (test) {
        let template = new TwingTestTemplateTemplate();

        try {
            template.traceableMethod(() => {
                throw new Error('foo error');
            }, 1, new TwingSource('', 'foo'))();
        }
        catch (e) {
            test.same(e.message, 'An exception has been thrown during the rendering of a template ("foo error") in "foo" at line 1.');
            test.same(e.constructor.name, 'TwingErrorRuntime');
        }

        test.end();
    });

    test.test('traceableDisplayBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'displayBlock');

        template.traceableDisplayBlock(1, null)();

        test.same(stub.callCount, 1, 'should call displayBlock once');

        test.end();
    });

    test.test('traceableDisplayParentBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'displayParentBlock');

        template.traceableDisplayParentBlock(1, null)();

        test.same(stub.callCount, 1, 'should call displayParentBlock once');

        test.end();
    });

    test.test('traceableRenderBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'renderBlock');

        template.traceableRenderBlock(1, null)();

        test.same(stub.callCount, 1, 'should call renderBlock once');

        test.end();
    });

    test.test('traceableRenderParentBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'renderParentBlock');

        template.traceableRenderParentBlock(1, null)();

        test.same(stub.callCount, 1, 'should call renderParentBlock once');

        test.end();
    });

    test.test('traceableHasBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'hasBlock');

        template.traceableHasBlock(1, null)();

        test.same(stub.callCount, 1, 'should call hasBlock once');

        test.end();
    });

    test.test('getAttribute', function (test) {
        class Foo {
            constructor() {
                this.oof = 'oof';
            }

            foo() {
                return 'foo';
            }

            getFoo() {
                return 'getFoo';
            }

            getBar() {
                return 'getBar';
            }

            isBar() {
                return 'isBar';
            }

            hasBar() {
                return 'hasBar';
            }

            isOof() {
                return 'isOof';
            }

            hasFooBar() {
                return 'hasFooBar';
            }

            __call() {

            }
        }

        class TwingTestExtensionCoreTemplate extends TwingTemplate {

        }

        let template = new TwingTestTemplateTemplate();

        let source = new TwingSource('', '');

        let getAttribute = template.getPublicGetAttribute();
        
        test.test('should support method calls', function (test) {
            let foo = new Foo();

            // object property
            test.same(getAttribute(new Foo(), 'oof', TwingTemplate.ANY_CALL, [], true), true);
            test.same(getAttribute(new Foo(), 'oof', TwingTemplate.ANY_CALL, [], false), 'oof');

            test.same(getAttribute(foo, 'foo'), 'foo', 'should resolve methods by their name');
            test.same(getAttribute(foo, 'bar'), 'getBar', 'should resolve get{name} if {name} doesn\'t exist');
            test.same(getAttribute(foo, 'Oof'), 'isOof', 'should resolve is{name} if {name} and get{name} don\'t exist');
            test.same(getAttribute(foo, 'fooBar'), 'hasFooBar', 'should resolve has{name} if {name}, get{name} and is{name} don\'t exist');

            test.same(getAttribute(foo, 'getfoo'), 'getFoo', 'should resolve method in a case-insensitive way');
            test.same(getAttribute(foo, 'GeTfOo'), 'getFoo', 'should resolve method in a case-insensitive way');

            // !METHOD_CALL + boolean item
            test.same(getAttribute([2, 3], false), 2);
            test.same(getAttribute([2, 3], true), 3);

            // !METHOD_CALL + float item
            test.same(getAttribute([2, 3], 0.1), 2);
            test.same(getAttribute([2, 3], 1.1), 3);

            test.throws(function () {
                getAttribute([], 0);
            }, new TwingErrorRuntime('Index "0" is out of bounds as the array is empty.', -1, source));

            test.throws(function () {
                getAttribute([1], 1);
            }, new TwingErrorRuntime('Index "1" is out of bounds for array [1].', -1, source));

            test.throws(function () {
                getAttribute(new Map(), 'foo');
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a object variable ("[object Map]").', -1, source));

            test.throws(function () {
                getAttribute(null, 'foo', [], TwingTemplate.ARRAY_CALL);
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a null variable.', -1, source));

            test.throws(function () {
                getAttribute(5, 'foo', [], TwingTemplate.ARRAY_CALL);
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a number variable ("5").', -1, source));

            test.throws(function () {
                getAttribute(null, 'foo', [], TwingTemplate.ANY_CALL);
            }, new TwingErrorRuntime('Impossible to access an attribute ("foo") on a null variable.', -1, source));

            // METHOD_CALL
            test.equals(getAttribute(5, 'foo', [], TwingTemplate.METHOD_CALL, true), false);
            test.equals(getAttribute(5, 'foo', [], TwingTemplate.METHOD_CALL, false, true), undefined);

            test.throws(function () {
                getAttribute(null, 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on a null variable.', -1, source));

            test.throws(function () {
                getAttribute(5, 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on a number variable ("5").', -1, source));

            test.throws(function () {
                getAttribute([], 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on an array.', -1, source));

            test.throws(function () {
                getAttribute(new TwingTestExtensionCoreTemplate(template.env), 'foo');
            }, new TwingErrorRuntime('Accessing TwingTemplate attributes is forbidden.', -1));

            test.throws(function () {
                getAttribute(new Foo(), 'ooof', TwingTemplate.ANY_CALL, [], false, false);
            }, new TwingErrorRuntime('Neither the property "ooof" nor one of the methods ooof()" or "getooof()"/"isooof()"/"hasooof()" exist and have public access in class "Foo".', -1, source));

            test.end();
        });

        test.test('supports strict variables set to false', function(test) {
            let template = new TwingTestTemplateTemplate(false);
            let getAttribute = template.getPublicGetAttribute();

            test.same(getAttribute(new Foo(), 'oof', TwingTemplate.ANY_CALL, [], false), 'oof');

            test.end();
        });

        test.end();
    });

    test.end();
});