const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingTemplateWrapper = require('../../../../lib/twing/template-wrapper').TwingTemplateWrapper;
const TwingOutputBuffering = require('../../../../lib/twing/output-buffering').TwingOutputBuffering;
const TwingErrorRuntime = require('../../../../lib/twing/error/runtime').TwingErrorRuntime;
const TwingSource = require('../../../../lib/twing/source').TwingSource;

const tap = require('tap');
const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

tap.test('template wrapper', function (test) {
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

        try {
            let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('invalid'));

            wrapper.renderBlock('foo', {
                foo: {
                    bar: () => {
                        throw new Error('foo.bar')
                    }
                }
            });
        }
        catch (e) {
            test.same(TwingOutputBuffering.obGetLevel(), 0);
            test.same(e, new TwingErrorRuntime('An exception has been thrown during the rendering of a template ("foo.bar").', 1, new TwingSource('', 'invalid', ''), new Error('foo.bar')));
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

    test.end();
});