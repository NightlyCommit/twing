const TwingExtensionSourceMap = require('../../../../../lib/twing/extension/source-map').TwingExtensionSourceMap;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;

const tap = require('tap');
const merge = require('merge');
const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

let templates = new Map([
    ['basic', 'Foo{{ bar }}'],
    ['multiple_lines', `Foo{{ bar }}

Oof{{ bar }}`] // Foo => line 1, column 0; Bar => line 1, column 6; Oof => line 3, column 0; Bar => line 3, column 6
]);

let getEnvironment = (options = {}) => {
    let loader = new TwingLoaderArray(templates);
    let twing = new TwingEnvironment(loader, merge({cache: false}, options));

    return twing;
};

tap.test('extension/source-map', function (test) {
    test.test('getSourceMap', function(test) {
        let env = getEnvironment();
        let sourceMapExtension = new TwingExtensionSourceMap();

        env.addExtension(sourceMapExtension);

        let render = env.render('multiple_lines', {
            bar: 'Bar'
        });

        console.warn(sourceMapExtension.getSourceMap());

        test.same(render, 'FooBar\n\nOofBar');

        test.end();
    });

    test.end();
});
