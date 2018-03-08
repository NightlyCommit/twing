const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingTemplateWrapper = require('../../../../lib/twing/template-wrapper').TwingTemplateWrapper;
const TwingOutputBuffering = require('../../../../lib/twing/output-buffering').TwingOutputBuffering;

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

    test.test('renderBlock', async function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{% block foo %}{{ foo }}{{ bar }}{% endblock %}'
        }));
        twing.addGlobal('bar', 'BAR');

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        test.same(await wrapper.renderBlock('foo', {foo: 'FOO'}), 'FOOBAR');

        test.end();
    });

    test.test('displayBlock', async function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray({
            'index': '{% block foo %}{{ foo }}{{ bar }}{% endblock %}'
        }));
        twing.addGlobal('bar', 'BAR');

        let wrapper = new TwingTemplateWrapper(twing, twing.loadTemplate('index'));

        TwingOutputBuffering.obStart();
        await wrapper.displayBlock('foo', {foo: 'FOO'})

        test.same(TwingOutputBuffering.obGetClean(), 'FOOBAR');

        test.end();
    });

    test.end();
});