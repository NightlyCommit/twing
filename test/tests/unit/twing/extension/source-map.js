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

let warmUp = (test, templates, options = {}) => {
    let cachePath = path.join('tmp', test.name);

    fs.emptyDirSync(cachePath);

    let loader = new TwingLoaderArray(templates);
    let twing = new TwingEnvironment(loader, merge(true, options, {
        source_map: true,
        cache: cachePath
    }));

    return {env: twing};
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

let assertOriginalPosition = (test, consumer, [generatedLine, generatedColumn], name, source, [originalLine, originalColumn]) => {
    test.same(consumer.originalPositionFor({
        line: generatedLine,
        column: generatedColumn,
        bias: SourceMapConsumer.GREATEST_LOWER_BOUND
    }), {
        line: originalLine,
        column: originalColumn,
        name: name,
        source: source
    }, `${generatedLine}/${generatedColumn} comes from "${name}" node located at ${originalLine}/${originalColumn} in "${source}" `);
};

tap.test('extension/source-map', function (test) {
    test.test('foo', function (test) {
        let {env} = warmUp(test, {
            index: `<div></div>
{% include "bar" %}`,
            bar: `<article></article>`
        });

        env.render('index', {
            foo: 'Foo'
        });

        let sourceMap = env.getSourceMap();

        test.end();
    });

    test.end();
});
