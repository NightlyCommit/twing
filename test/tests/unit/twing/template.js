const TwingTemplate = require("../../../../lib/twing/template").TwingTemplate;
const TwingEnvironment = require("../../../../lib/twing/environment").TwingEnvironment;
const TwingLoaderArray = require("../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingSource = require("../../../../lib/twing/source").TwingSource;
const TwingErrorRuntime = require("../../../../lib/twing/error/runtime").TwingErrorRuntime;
const TwingOutputBuffering = require("../../../../lib/twing/output-buffering").TwingOutputBuffering;

const tap = require('tap');
const path = require('path');
const sinon = require('sinon');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

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

tap.test('template', function (test) {
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

        test.end();
    });

    test.end();
});