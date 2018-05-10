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

/**
 *
 * @param {SourceMapConsumer} consumer
 */
let getMappings = (consumer) => {
    let results = [];

    consumer.eachMapping((m) => {
        results.push(m);
    });

    return results;
};

tap.test('extension/source-map', function (test) {
    test.test('supports node of type', function (test) {
//         test.test('text', function (test) {
//             test.test('empty', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: ''
//                 });
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//                 let mappings = getMappings(consumer);
//
//                 test.same(render, '');
//                 test.same(mappings, []);
//
//                 test.end();
//             });
//
//             test.test('consisting of a single line', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: 'Foo'
//                 });
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//                 let mappings = getMappings(consumer);
//
//                 console.warn(mappings);
//
//                 test.same(render, 'Foo');
//                 test.same(mappings, [
//                     {
//                         generatedLine: 1,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     }
//                 ]);
//
//                 test.end();
//             });
//
//             test.test('consisting of a single line-feed', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: '\n'
//                 });
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//                 let mappings = getMappings(consumer);
//
//                 test.same(render, '\n');
//                 test.same(mappings, [
//                     {
//                         generatedLine: 1,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     }
//                 ]);
//
//                 test.end();
//             });
//
//             test.test('consisting of multiple lines', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: `
// Foo
//
//
// `
//                 });
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//
//                 test.same(render, `
// Foo
//
//
// `);
//
//                 let mappings = getMappings(consumer);
//
//                 test.same(mappings, [
//                     {
//                         generatedLine: 1,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     },
//                     {
//                         generatedLine: 2,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     },
//                     {
//                         generatedLine: 3,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     },
//                     {
//                         generatedLine: 4,
//                         generatedColumn: 0,
//                         lastGeneratedColumn: null,
//                         source: 'index',
//                         originalLine: 1,
//                         originalColumn: 0,
//                         name: 'text'
//                     }
//                 ]);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
        test.test('print', function (test) {
            test.test('alone', async function (test) {
                let {env, extension} = warmUp({
                    index: '{{ foo }}'
                });

                let render = env.render('index', {
                    foo: 'Foo'
                });

                /** @type SourceMapConsumer **/
                let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

                test.same(render, 'Foo');

                let mappings = getMappings(consumer);

                test.same(mappings, [
                    {
                        generatedLine: 1,
                        generatedColumn: 0,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'print'
                    }
                ]);

                test.end();
            });

            test.test('preceded by a single line text', async function (test) {
                let {env, extension} = warmUp({
                    index: 'Foo{{ foo }}'
                });

                let render = env.render('index', {
                    foo: 'Foo'
                });

                /** @type SourceMapConsumer **/
                let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());

                test.same(render, 'FooFoo');

                let mappings = getMappings(consumer);

                test.same(mappings, [
                    {
                        generatedLine: 1,
                        generatedColumn: 0,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        generatedLine: 1,
                        generatedColumn: 3,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 1,
                        originalColumn: 3,
                        name: 'print'
                    }
                ]);

                test.end();
            });
//
            test.test('preceded by a multiple lines text', async function (test) {
                fs.emptyDirSync('tmp/print');

                let {env, extension} = warmUp({
                    index: `
Foo
{{ foo }}`
                }, {cache: 'tmp/print'});

                let render = env.render('index', {
                    foo: 'Foo'
                });

                /** @type SourceMapConsumer **/
                let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
                let mappings = getMappings(consumer);

                console.warn(mappings);

                test.same(render, `
Foo
Foo`);
                test.same(mappings, [
                    {
                        generatedLine: 1,
                        generatedColumn: 0,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        generatedLine: 2,
                        generatedColumn: 0,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 1,
                        originalColumn: 0,
                        name: 'text'
                    },
                    {
                        generatedLine: 3,
                        generatedColumn: 0,
                        lastGeneratedColumn: null,
                        source: 'index',
                        originalLine: 3,
                        originalColumn: 0,
                        name: 'print'
                    }
                ]);

                test.end();
            });

            test.end();
        });

        test.test('include', async function (test) {
            fs.emptyDirSync('tmp/include');

            let {env, extension} = warmUp({
                index: '{% include "base" %}',
                base: '{{ foo }}'
            }, {cache: 'tmp/include'});

            let render = env.render('index', {
                foo: 'Foo'
            });

            /** @type SourceMapConsumer **/
            let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
            let mappings = getMappings(consumer);

            console.warn(mappings);

            test.same(render, 'Foo');
            test.same(mappings, [
                {
                    generatedColumn: 0,
                    generatedLine: 1,
                    lastGeneratedColumn: null,
                    name: 'print',
                    originalColumn: 0,
                    originalLine: 1,
                    source: 'base'
                }
            ]);

            test.end();
        });

        test.test('spaceless', async function (test) {
            fs.emptyDirSync('tmp/spaceless');

            let {env, extension} = warmUp({
                index: '{% spaceless %}<Foo>{{ foo }}{% endspaceless %}'
            }, {cache: 'tmp/spaceless'});

            let render = env.render('index', {
                foo: 'Foo'
            });

            /** @type SourceMapConsumer **/
            let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
            let mappings = getMappings(consumer);

            test.same(render, '<Foo>Foo');
            test.same(mappings, [
                {
                    generatedColumn: 0,
                    generatedLine: 1,
                    lastGeneratedColumn: null,
                    name: 'text',
                    originalColumn: 15,
                    originalLine: 1,
                    source: 'index'
                },
                {
                    generatedColumn: 5,
                    generatedLine: 1,
                    lastGeneratedColumn: null,
                    name: 'print',
                    originalColumn: 20,
                    originalLine: 1,
                    source: 'index'
                }
            ]);

            test.test('with include', async function(test) {
                let {env, extension} = warmUp({
                    index: '{% spaceless %}{% include "partial" %}{% endspaceless %}',
                    partial: '{{ foo }}<Foo>'
                }, {cache: 'tmp/spaceless'});

                let render = env.render('index', {
                    foo: 'FooBar'
                });

                /** @type SourceMapConsumer **/
                let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
                let mappings = getMappings(consumer);

                test.same(render, 'FooBar<Foo>');
                test.same(mappings, [
                    {
                        generatedColumn: 0,
                        generatedLine: 1,
                        lastGeneratedColumn: null,
                        name: 'print',
                        originalColumn: 0,
                        originalLine: 1,
                        source: 'partial'
                    },
                    {
                        generatedColumn: 6,
                        generatedLine: 1,
                        lastGeneratedColumn: null,
                        name: 'text',
                        originalColumn: 9,
                        originalLine: 1,
                        source: 'partial'
                    }
                ]);

                let a = consumer.originalPositionFor({
                    line: 1,
                    column: 0
                });

                console.warn('A', a);

                test.end();
            });

            test.end();
        });
//
//         test.test('sandboxed print', async function (test) {
//             let {env, extension} = warmUp({
//                 index: '{% sandbox %}Foo{% endsandbox %}'
//             });
//
//             env.addExtension(new TwingExtensionSandbox(new TwingSandboxSecurityPolicy()));
//
//             let render = env.render('index');
//
//             /** @type SourceMapConsumer **/
//             let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//
//             test.same(render, 'Foo');
//             test.same(consumer.originalPositionFor({
//                 line: 1,
//                 column: 0,
//                 bias: SourceMapConsumer.GREATEST_LOWER_BOUND
//             }), {
//                 line: 1,
//                 column: 13,
//                 name: TwingNodeType.TEXT,
//                 source: 'index'
//             });
//
//             test.end();
//         });
//
//         test.test('macro', function (test) {
//             test.test('from self', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: `{% macro foo() %}Foo{% endmacro %}
// {% import _self as macros %}
// {{ macros.foo() }}`
//                 }, {cache: 'tmp/macro'});
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//
//                 test.same(render, 'Foo');
//                 test.same(consumer.originalPositionFor({
//                     line: 1,
//                     column: 0,
//                     bias: SourceMapConsumer.GREATEST_LOWER_BOUND
//                 }), {
//                     line: 1,
//                     column: 17,
//                     name: TwingNodeType.TEXT,
//                     source: 'index'
//                 });
//
//                 test.end();
//             });
//
//             test.test('from import', async function (test) {
//                 let {env, extension} = warmUp({
//                     index: `{% import "macros" as macros %}
// {{ macros.foo() }}`,
//                     macros: '{% macro foo() %}Foo{% endmacro %}'
//                 }, {cache: 'tmp/macro'});
//
//                 let render = env.render('index');
//
//                 /** @type SourceMapConsumer **/
//                 let consumer = await SourceMapConsumer.fromSourceMap(extension.getGenerator());
//
//                 test.same(render, 'Foo');
//                 test.same(consumer.originalPositionFor({
//                     line: 1,
//                     column: 0,
//                     bias: SourceMapConsumer.GREATEST_LOWER_BOUND
//                 }), {
//                     line: 1,
//                     column: 17,
//                     name: TwingNodeType.TEXT,
//                     source: 'macros'
//                 });
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
        test.end();
    });

    test.end();
});
