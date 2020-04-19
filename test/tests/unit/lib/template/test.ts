import * as tape from 'tape';
import {TwingOutputBuffering} from "../../../../../src/lib/output-buffering";
import {TwingTemplate, TwingTemplateBlocksMap} from "../../../../../src/lib/template";
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

        this.sourceContext = new TwingSource('', 'foo');
    }

    getEnv(): TwingEnvironment {
        return this.env;
    }

    setEnv(env: TwingEnvironment) {
        this.env = env;
    }

    displayWithErrorHandling(context: any, blocks: TwingTemplateBlocksMap) {
        return super.displayWithErrorHandling(context, blocks);
    }

    doDisplay(context: {}, blocks: TwingTemplateBlocksMap): Promise<void> {
        TwingOutputBuffering.echo('foo');

        return Promise.resolve();
    }

    doGetParent(context: any): Promise<TwingTemplate | string | false> {
        return super.doGetParent(context);
    }

    displayParentBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map()): Promise<void> {
        return super.displayParentBlock(name, context, blocks);
    }

    displayBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks: boolean = true): Promise<void> {
        return super.displayBlock(name, context, blocks, useBlocks);
    }

    renderParentBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map()): Promise<string> {
        return super.renderParentBlock(name, context, blocks);
    }

    renderBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks: boolean = true): Promise<string> {
        return super.renderBlock(name, context, blocks, useBlocks);
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

    doDisplay(context: {}, blocks: Map<string, Array<any>>): Promise<void> {
        return this.loadTemplate('not_found').then(() => {
            return;
        });
    }

    getSourceContext() {
        return new TwingSource('code', 'path');
    }
}

tape('template', function (test) {
    test.test('environment accessor', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.environment, template.getEnv());

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.getSourceContext(), new TwingSource('', 'foo'));

        test.end();
    });

    test.test('getParent', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'doGetParent');

        stub.returns(Promise.resolve(false));

        test.same(await template.getParent(), false);

        stub.returns(Promise.resolve('foo'));

        test.true(await template.getParent() instanceof TwingTemplate);

        stub.returns(Promise.resolve('bar'));

        try {
            await template.getParent();

            test.fail();
        } catch (e) {
            test.same(e.message, 'Template "bar" is not defined in "foo".');
        }

        stub.returns(Promise.reject(new Error('foo')));

        try {
            await template.getParent();

            test.fail();
        } catch (e) {
            test.same(e.message, 'foo');
        }

        test.end();
    });

    test.test('displayParentBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'getParent');

        stub.returns(Promise.resolve(false));

        try {
            await template.displayParentBlock('foo', {});

            test.fail();
        } catch (e) {
            test.same(e.message, 'The template has no parent and no traits defining the "foo" block in "foo".');
        }

        test.end();
    });

    test.test('displayBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'getParent');

        stub.returns(Promise.resolve(false));

        try {
            await template.displayBlock('foo', {});
        } catch (e) {
            test.true(e instanceof TwingErrorRuntime);
            test.same(e.rawMessage, 'Block "foo" on template "foo" does not exist.')
        }

        test.end();
    });

    test.test('renderParentBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'doGetParent');

        stub.returns(Promise.resolve('foo'));

        test.same(await template.renderParentBlock('foo', {}, new Map()), 'foo');
        test.same(await template.renderParentBlock('foo', {}), 'foo');

        test.end();
    });

    test.test('loadTemplate', async (test) => {
        let template = new TwingTestTemplateTemplate();

        template.setEnv(null);

        try {
            await template.loadTemplate('foo');

            test.fail('should throw an Error');
        } catch (e) {
            test.true(e instanceof Error);
            test.same(e.message, 'Cannot read property \'loadTemplate\' of null')
        }

        test.test('should return an error with full source information when templateName is set', async (test) => {
            let template = new TwingTestTemplateTemplateWithInvalidLoadTemplate();

            try {
                await template.display({});

                test.fail('should throw an Error');
            } catch (e) {
                test.true(e instanceof TwingErrorLoader);
                test.same(e.message, 'Template "not_found" is not defined in "path".');
                test.same(e.getSourceContext(), new TwingSource('code', 'path'));
            }

            test.end();
        });

        test.end();
    });

    test.test('doGetParent', async (test) => {
        let template = new TwingTestTemplateTemplate();

        test.equals(await template.doGetParent('foo'), false);

        test.end();
    });

    test.test('display', async (test) => {
        let template = new TwingTestTemplateTemplate();

        try {
            await template.display(null);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Argument 1 passed to TwingTemplate::display() must be an iterator, null given');
        }

        test.end();
    });

    test.test('displayWithErrorHandling', async (test) => {
        let template = new TwingTestTemplateTemplate();

        TwingOutputBuffering.obStart();

        await template.displayWithErrorHandling({}, undefined);

        let content = TwingOutputBuffering.obGetContents();

        test.same(content, 'foo');

        test.test('should rethrow native error as TwingErrorRuntime', async (test) => {
            sinon.stub(template, 'doDisplay').returns(Promise.reject(new Error('foo error')));

            try {
                await template.displayWithErrorHandling({}, new Map());

                test.fail();
            } catch (e) {
                test.same(e.constructor.name, 'TwingErrorRuntime');
                test.same(e.message, 'An exception has been thrown during the rendering of a template ("foo error") in "foo".');
            }

            test.end();
        });

        test.end();
    });

    test.test('traceableMethod', async (test) => {
        let template = new TwingTestTemplateTemplate();

        try {
            await template.traceableMethod(() => {
                return Promise.reject(new Error('foo error'));
            }, 1, new TwingSource('', 'foo'))();
        } catch (e) {
            test.same(e.message, 'An exception has been thrown during the rendering of a template ("foo error") in "foo" at line 1.');
            test.same(e.constructor.name, 'TwingErrorRuntime');
        }

        test.end();
    });

    test.test('traceableDisplayBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'displayBlock').returns(Promise.resolve());

        await template.traceableDisplayBlock(1, null)();

        test.same(stub.callCount, 1, 'should call displayBlock once');

        test.end();
    });

    test.test('traceableDisplayParentBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'displayParentBlock').returns(Promise.resolve());

        await template.traceableDisplayParentBlock(1, null)();

        test.same(stub.callCount, 1, 'should call displayParentBlock once');

        test.end();
    });

    test.test('traceableRenderBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'renderBlock').returns(Promise.resolve(''));

        await template.traceableRenderBlock(1, null)();

        test.same(stub.callCount, 1, 'should call renderBlock once');

        test.end();
    });

    test.test('traceableRenderParentBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'renderParentBlock').returns(Promise.resolve(''));

        await template.traceableRenderParentBlock(1, null)();

        test.same(stub.callCount, 1, 'should call renderParentBlock once');

        test.end();
    });

    test.test('traceableHasBlock', async (test) => {
        let template = new TwingTestTemplateTemplate();
        let stub = sinon.stub(template, 'hasBlock').returns(Promise.resolve(true));

        await template.traceableHasBlock(1, null)();

        test.same(stub.callCount, 1, 'should call hasBlock once');

        test.end();
    });

    test.end();
});
