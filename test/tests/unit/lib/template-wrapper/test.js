const {
    TwingEnvironment,
    TwingLoaderArray,
    TwingTemplateWrapper,
    TwingOutputBuffering,
    TwingErrorRuntime,
    TwingSource
} = require('../../../../../build/main');

const test = require('tape');
const sinon = require('sinon');

test('template wrapper', function (test) {
    test.test('hasGetBlocks', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{% block foo %}{% endblock %}',
            'index_with_use': '{% use "imported" %}{% block foo %}{% endblock %}',
            'index_with_extends': '{% extends "extended" %}{% block foo %}{% endblock %}',
            'imported': '{% block imported %}{% endblock %}',
            'extended': '{% block extended %}{% endblock %}'
        }));

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));
        test.true(wrapper.hasBlock('foo'));
        test.false(wrapper.hasBlock('bar'));
        test.same(wrapper.getBlockNames(), ['foo']);

        wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index_with_use'));
        test.true(wrapper.hasBlock('foo'));
        test.true(wrapper.hasBlock('imported'));
        test.same(wrapper.getBlockNames(), ['imported', 'foo']);

        wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index_with_extends'));
        test.true(wrapper.hasBlock('foo'));
        test.true(wrapper.hasBlock('extended'));
        test.same(wrapper.getBlockNames(), ['foo', 'extended']);

        test.end();
    });

    test.test('renderBlock', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{% block foo %}{{ foo }}{{ bar }}{% endblock %}',
            'invalid': '{% block foo %}{{ foo.bar }}{% endblock %}'
        }));
        twing.addGlobal('bar', 'BAR');

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        test.same(wrapper.renderBlock('foo', {foo: 'FOO'}), 'FOOBAR');
        test.same(wrapper.renderBlock('foo'), 'BAR');
        test.same(wrapper.renderBlock('foo', new Map([['foo', 'FOO']])), 'FOOBAR');

        let source = new TwingSource('', 'invalid', '');

        try {
            let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('invalid'));

            wrapper.traceableRenderBlock(1, source)('foo', {
                foo: {
                    bar: () => {
                        throw new Error('foo.bar')
                    }
                }
            });
        }
        catch (e) {
            test.same(TwingOutputBuffering.obGetLevel(), 0);
            test.same(e, new TwingErrorRuntime('An exception has been thrown during the rendering of a template ("foo.bar").', 1, source, new Error('foo.bar')));
        }

        test.end();
    });

    test.test('displayBlock', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{% block foo %}{{ foo }}{{ bar }}{% endblock %}'
        }));
        twing.addGlobal('bar', 'BAR');

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        TwingOutputBuffering.obStart();
        wrapper.displayBlock('foo', {foo: 'FOO'});
        wrapper.displayBlock('foo');

        test.same(TwingOutputBuffering.obGetClean(), 'FOOBARBAR');

        test.end();
    });

    test.test('render', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{{ foo }}BAR'
        }));

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        test.same(wrapper.render({foo: 'FOO'}), 'FOOBAR');
        test.same(wrapper.render(), 'BAR');

        test.end();
    });

    test.test('getSourceContext', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{{ foo }}BAR'
        }));

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        test.same(wrapper.getSourceContext(), new TwingSource('', 'index'));

        test.end();
    });

    test.test('traceableDisplayBlock', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: ''
        }));

        let wrapper = new TwingTemplateWrapper(env, env.loadTemplate('index'));
        let stub = sinon.stub(wrapper, 'displayBlock');
        let templateSpy = sinon.spy(wrapper.template, 'traceableMethod');

        wrapper.traceableDisplayBlock(1, null)();

        test.same(stub.callCount, 1, 'should call displayBlock once');
        test.same(templateSpy.callCount, 1, 'should call template traceableMethod once');

        test.end();
    });

    test.test('traceableDisplayParentBlock', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: ''
        }));

        let wrapper = new TwingTemplateWrapper(env, env.loadTemplate('index'));
        let spy = sinon.spy(wrapper.template, 'traceableDisplayParentBlock');

        wrapper.traceableDisplayParentBlock(1, null);

        test.same(spy.callCount, 1, 'should call template traceableDisplayParentBlock once');

        test.end();
    });

    test.test('traceableRenderBlock', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: ''
        }));

        let wrapper = new TwingTemplateWrapper(env, env.loadTemplate('index'));
        let stub = sinon.stub(wrapper, 'renderBlock');
        let templateSpy = sinon.spy(wrapper.template, 'traceableMethod');

        wrapper.traceableRenderBlock(1, null)();

        test.same(stub.callCount, 1, 'should call renderBlock once');
        test.same(templateSpy.callCount, 1, 'should call template traceableMethod once');

        test.end();
    });

    test.test('traceableRenderParentBlock', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: ''
        }));

        let wrapper = new TwingTemplateWrapper(env, env.loadTemplate('index'));
        let spy = sinon.spy(wrapper.template, 'traceableRenderParentBlock');

        wrapper.traceableRenderParentBlock(1, null);

        test.same(spy.callCount, 1, 'should call template traceableRenderParentBlock once');

        test.end();
    });

    test.test('traceableHasBlock', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({
            index: ''
        }));

        let wrapper = new TwingTemplateWrapper(env, env.loadTemplate('index'));
        let spy = sinon.spy(wrapper.template, 'traceableHasBlock');

        wrapper.traceableHasBlock(1, null);

        test.same(spy.callCount, 1, 'should call template traceableHasBlock once');

        test.end();
    });

    test.end();
});