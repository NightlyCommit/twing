const {
    TwingTemplate,
    TwingEnvironment,
    TwingLoaderArray,
    TwingSource,
    TwingErrorRuntime,
    TwingOutputBuffering
} = require("../../../../../build");

const test = require('tape');
const sinon = require('sinon');

class TwingTestTemplateTemplate extends TwingTemplate {
    constructor() {
        super(new TwingEnvironment(new TwingLoaderArray({
            foo: '{% block foo %}foo{% endblock %}'
        })));
    }

    getTemplateName() {
        return 'foo';
    }

    doDisplay(context, blocks) {
        TwingOutputBuffering.echo('foo');
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

        template.env = null;

        try {
            template.loadTemplate('foo');

            test.fail('should throw an Error');
        }
        catch (e) {
            test.true(e instanceof Error);
            test.same(e.message, 'Cannot read property \'loadTemplate\' of null')
        }

        test.end();
    });

    test.test('doGetParent', function (test) {
        let template = new TwingTestTemplateTemplate();

        test.equals(template.doGetParent('foo'), false);

        test.end();
    });

    test.test('displayWithErrorHandling', function (test) {
        let template = new TwingTestTemplateTemplate();

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