import * as tape from 'tape';
import {TwingOutputBuffering} from "../../../../../src/lib/output-buffering";
import {TwingTemplate} from "../../../../../src/lib/template";
import {TwingEnvironmentNode} from "../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../src/lib/loader/array";
import {TwingLoaderChain} from "../../../../../src/lib/loader/chain";
import {TwingSource} from "../../../../../src/lib/source";
import {TwingErrorRuntime} from "../../../../../src/lib/error/runtime";
import {TwingErrorLoader} from "../../../../../src/lib/error/loader";
import {TwingEnvironment} from "../../../../../src/lib/environment";

const sinon = require('sinon');

class TwingTestTemplateTemplate extends TwingTemplate {
    constructor() {
        super(new TwingEnvironmentNode(new TwingLoaderArray({
            foo: '{% block foo %}foo{% endblock %}'
        })));
    }

    setEnv(env: TwingEnvironment) {
        this.env = env;
    }

    getTemplateName() {
        return 'foo';
    }

    displayWithErrorHandling(context: any, blocks: Map<string, Array<any>>) {
        super.displayWithErrorHandling(context, blocks);
    }

    doDisplay(context: {}, blocks: Map<string, Array<any>>): void {
        TwingOutputBuffering.echo('foo');
    }

    doGetParent(context: any): TwingTemplate | string | false {
        return super.doGetParent(context);
    }
}

class TwingTestTemplateTemplateWithInvalidLoadTemplate extends TwingTemplate {
    constructor() {
        super(new TwingEnvironmentNode(new TwingLoaderChain([
            new TwingLoaderArray({})
        ])));
    }

    getTemplateName() {
        return 'foo';
    }

    doDisplay(context: {}, blocks: Map<string, Array<any>>): void {
        this.loadTemplate('not_found', 'foo');
    }

    getSourceContext() {
        return new TwingSource('code', 'foo', 'path');
    }
}

tape('template', function (test) {
    test.test('toString', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.toString(), template.getTemplateName());

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.getSourceContext(), new TwingSource('', template.getTemplateName()));

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

        stub.returns(false);

        test.throws(function () {
            template.displayParentBlock('foo', {});
        });

        test.end();
    });

    test.test('displayBlock', function (test) {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'getParent');

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

        template.setEnv(null);

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

    test.test('display', function (test) {
        let template = new TwingTestTemplateTemplate();

        try {
            template.display(null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Argument 1 passed to TwingTemplate::display() must be an iterator, null given');
        }

        test.end();
    });

    test.test('displayWithErrorHandling', function (test) {
        let template = new TwingTestTemplateTemplate();

        TwingOutputBuffering.obStart();
        template.displayWithErrorHandling({}, undefined);
        let content = TwingOutputBuffering.obGetContents();

        test.same(content, 'foo');

        test.test('should rethrow native error as TwingErrorRuntime', (test) => {
            sinon.stub(template, 'doDisplay').callsFake(() => {
                throw new Error('foo error');
            });

            try {
                template.displayWithErrorHandling({}, new Map());

                test.fail();
            }
            catch (e) {
                test.same(e.constructor.name, 'TwingErrorRuntime');
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

    test.end();
});