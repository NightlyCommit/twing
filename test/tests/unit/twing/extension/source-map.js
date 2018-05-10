const TwingExtensionSourceMap = require('../../../../../lib/twing/extension/source-map').TwingExtensionSourceMap;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;

const tap = require('tap');
const merge = require('merge');
const path = require('path');
const fs = require('fs-extra');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

let warmUp = (templates, options = {}) => {
    // clean cache
    fs.emptyDirSync('tmp');

    let loader = new TwingLoaderArray(templates);
    let twing = new TwingEnvironment(loader, options);

    let sourceMapExtension = new TwingExtensionSourceMap();

    twing.addExtension(sourceMapExtension);

    return {env: twing, extension: sourceMapExtension};
};

tap.test('extension/source-map', function (test) {
    test.test('include', function(test) {
        let {env, extension} = warmUp({
            index: '{% set base %}{% include "base" %}{% endset %}{{ base }}',
            base: '{{ foo }}'
        }, {cache: 'tmp'});

        let render = env.render('index', {
            foo: 'Foo'
        });

        console.warn(extension.getSourceMap());

        test.same(render, 'Foo');

        test.end();
    });

    test.end();
});
