const TwingExtensionSourceMap = require('../../../../../lib/twing/extension/source-map').TwingExtensionSourceMap;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const {TwingNodeType} = require("../../../../../lib/twing/node");
const {SourceMapConsumer} = require('source-map');
const {TwingExtensionSandbox} = require('../../../../../lib/twing/extension/sandbox');
const {TwingSandboxSecurityPolicy} = require('../../../../../lib/twing/sandbox/security-policy');

const tap = require('tap');
const merge = require('merge');
const path = require('path');
const fs = require('fs-extra');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

let warmUp = (templates, options = {}) => {
    let loader = new TwingLoaderArray(templates);
    let twing = new TwingEnvironment(loader, options);

    let sourceMapExtension = new TwingExtensionSourceMap();

    twing.addExtension(sourceMapExtension);

    return {env: twing, extension: sourceMapExtension};
};

tap.test('extension/source-map', function (test) {
    test.test('text', async function(test) {
        let {env, extension} = warmUp({
            index: 'Foo'
        }, {cache: 'tmp'});

        let render = env.render('index');

        /** @type SourceMapConsumer **/
        let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

        test.same(render, 'Foo');
        test.same(consumer.originalPositionFor({
            line: 1,
            column: 0,
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND
        }), {
            line: 1,
            column: 0,
            name: TwingNodeType.TEXT,
            source: 'index'
        });

        test.end();
    });

    test.test('print', async function(test) {
        let {env, extension} = warmUp({
            index: '{{ foo }}'
        });

        let render = env.render('index', {
            foo: 'Foo'
        });

        /** @type SourceMapConsumer **/
        let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

        test.same(render, 'Foo');
        test.same(consumer.originalPositionFor({
            line: 1,
            column: 0,
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND
        }), {
            line: 1,
            column: 0,
            name: TwingNodeType.PRINT,
            source: 'index'
        });

        test.end();
    });

    test.test('include', async function(test) {
        let {env, extension} = warmUp({
            index: '{% include "base" %}',
            base: '{{ foo }}'
        });

        let render = env.render('index', {
            foo: 'Foo'
        });

        /** @type SourceMapConsumer **/
        let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

        test.same(render, 'Foo');
        test.same(consumer.originalPositionFor({
            line: 1,
            column: 0,
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND
        }), {
            line: 1,
            column: 0,
            name: TwingNodeType.PRINT,
            source: 'base'
        });

        test.end();
    });

    test.test('spaceless', async function(test) {
        let {env, extension} = warmUp({
            index: '{% spaceless %} Foo {% endspaceless %}'
        });

        let render = env.render('index');

        /** @type SourceMapConsumer **/
        let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

        test.same(render, 'Foo');
        test.same(consumer.originalPositionFor({
            line: 1,
            column: 0,
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND
        }), {
            line: 1,
            column: 15,
            name: TwingNodeType.TEXT,
            source: 'index'
        });

        test.end();
    });

    test.test('sandboxed print', async function(test) {
        let {env, extension} = warmUp({
            index: '{% sandbox %}Foo{% endsandbox %}'
        });

        env.addExtension(new TwingExtensionSandbox(new TwingSandboxSecurityPolicy()));

        let render = env.render('index');

        /** @type SourceMapConsumer **/
        let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

        test.same(render, 'Foo');
        test.same(consumer.originalPositionFor({
            line: 1,
            column: 0,
            bias: SourceMapConsumer.GREATEST_LOWER_BOUND
        }), {
            line: 1,
            column: 13,
            name: TwingNodeType.TEXT,
            source: 'index'
        });

        test.end();
    });

    test.test('macro', function(test) {
        test.test('from self', async function(test) {
            let {env, extension} = warmUp({
                index: `{% macro foo() %}Foo{% endmacro %}
{% import _self as macros %}
{{ macros.foo() }}`
            }, {cache: 'tmp/macro'});

            let render = env.render('index');

            /** @type SourceMapConsumer **/
            let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

            test.same(render, 'Foo');
            test.same(consumer.originalPositionFor({
                line: 1,
                column: 0,
                bias: SourceMapConsumer.GREATEST_LOWER_BOUND
            }), {
                line: 1,
                column: 17,
                name: TwingNodeType.TEXT,
                source: 'index'
            });

            test.end();
        });

        test.test('from import', async function(test) {
            let {env, extension} = warmUp({
                index: `{% import "macros" as macros %}
{{ macros.foo() }}`,
                macros: '{% macro foo() %}Foo{% endmacro %}'
            }, {cache: 'tmp/macro'});

            let render = env.render('index');

            /** @type SourceMapConsumer **/
            let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

            test.same(render, 'Foo');
            test.same(consumer.originalPositionFor({
                line: 1,
                column: 0,
                bias: SourceMapConsumer.GREATEST_LOWER_BOUND
            }), {
                line: 1,
                column: 17,
                name: TwingNodeType.TEXT,
                source: 'macros'
            });

            test.end();
        });

        test.end();
    });

    test.end();
});
