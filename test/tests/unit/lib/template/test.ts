import * as tape from 'tape';
import {TwingOutputBuffer} from "../../../../../src/lib/output-buffer";
import {TwingTemplate, TwingTemplateBlocksMap} from "../../../../../src/lib/template";
import {TwingEnvironmentNode} from "../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../src/lib/loader/array";
import {TwingLoaderChain} from "../../../../../src/lib/loader/chain";
import {TwingSource} from "../../../../../src/lib/source";
import {TwingErrorRuntime} from "../../../../../src/lib/error/runtime";
import {TwingErrorLoader} from "../../../../../src/lib/error/loader";
import {TwingEnvironment} from "../../../../../src/lib/environment";
import {MockEnvironment} from "../../../../mock/environment";
import {MockTemplate} from "../../../../mock/template";

const sinon = require('sinon');

class TwingTestTemplateTemplate extends TwingTemplate {
    protected _mySource: TwingSource;

    constructor(environment?: TwingEnvironment) {
        super(environment !== undefined ? environment : new TwingEnvironmentNode(new TwingLoaderArray({
            foo: '{% block foo %}foo{% endblock %}'
        })));

        this._mySource = new TwingSource('', 'foo');
    }

    get source() {
        return this._mySource;
    }

    displayWithErrorHandling(context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap) {
        return super.displayWithErrorHandling(context, outputBuffer, blocks);
    }

    doDisplay(context: {}, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap): Promise<void> {
        outputBuffer.echo('foo');

        return Promise.resolve();
    }

    doGetParent(context: any): Promise<TwingTemplate | string | false> {
        return super.doGetParent(context);
    }

    displayParentBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: Map<string, [TwingTemplate, string]> = new Map()): Promise<void> {
        return super.displayParentBlock(name, context, outputBuffer, blocks);
    }

    displayBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks: boolean = true): Promise<void> {
        return super.displayBlock(name, context, outputBuffer, blocks, useBlocks);
    }

    renderParentBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: Map<string, [TwingTemplate, string]> = new Map()): Promise<string> {
        return super.renderParentBlock(name, context, outputBuffer, blocks);
    }

    renderBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks: boolean = true): Promise<string> {
        return super.renderBlock(name, context, outputBuffer, blocks, useBlocks);
    }
}

class TwingTestTemplateTemplateWithInvalidLoadTemplate extends TwingTemplate {
    constructor() {
        super(new TwingEnvironmentNode(new TwingLoaderChain([
            new TwingLoaderArray({})
        ])));
    }

    get templateName() {
        return 'foo';
    }

    doDisplay(context: {}, outputBuffer: TwingOutputBuffer, blocks: Map<string, Array<any>>): Promise<void> {
        return this.loadTemplate('not_found').then(() => {
            return;
        });
    }

    get source() {
        return new TwingSource('code', 'path');
    }
}

tape('template', function (test) {
    test.test('environment accessor', function (test) {
        let environment = new MockEnvironment();
        let template = new TwingTestTemplateTemplate(environment);

        test.same(template.environment, environment);

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.same(template.source.getName(), 'foo');

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
            await template.displayParentBlock('foo', {}, null);

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
            await template.displayBlock('foo', {}, null);
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

        test.same(await template.renderParentBlock('foo', {}, new TwingOutputBuffer(), new Map()), 'foo');
        test.same(await template.renderParentBlock('foo', {}, new TwingOutputBuffer()), 'foo');

        test.end();
    });

    test.test('loadTemplate', async (test) => {
        let template = new TwingTestTemplateTemplate(null);

        try {
            await template.loadTemplate('foo');

            test.fail('should throw an Error');
        } catch (e) {
            test.true(e instanceof Error);
            // Node.js v16 and later use a newer error message for properties of null.
            // TODO: Remove the Node.js v15 and earlier test after EOL on 2023-04-30.
            const oldErrorMessage = 'Cannot read property \'loadTemplate\' of null';
            if (e.message === oldErrorMessage) {
                // Node v15 and earlier.
                test.same(e.message, oldErrorMessage);
            } else {
                // Node v16 and later.
                test.same(e.message, 'Cannot read properties of null (reading \'loadTemplate\')');
            }
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

        let outputBuffer = new TwingOutputBuffer();

        outputBuffer.start();

        await template.displayWithErrorHandling({}, outputBuffer, undefined);

        let content = outputBuffer.getContents();

        test.same(content, 'foo');

        test.test('should rethrow native error as TwingErrorRuntime', async (test) => {
            sinon.stub(template, 'doDisplay').returns(Promise.reject(new Error('foo error')));

            try {
                await template.displayWithErrorHandling({}, outputBuffer, new Map());

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

    test.test('getMacro', async (test) => {
        const fooHandler = () => {
            return Promise.resolve('');
        };

        class TemplateWithMacros extends TwingTemplate {
            constructor() {
                super(new MockEnvironment());

                this.macroHandlers = new Map([
                    ['foo', fooHandler]
                ])
            }

            protected doDisplay(context: any, outputBuffer: TwingOutputBuffer, blocks: Map<string, [TwingTemplate, string]>): Promise<void> {
                return;
            }
        }

        let template = new TemplateWithMacros();

        test.same(await template.getMacro('foo'), fooHandler);
        test.same(await template.getMacro('bar'), null);

        test.end();
    });

    test.end();
});
