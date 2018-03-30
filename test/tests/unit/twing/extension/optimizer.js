const TwingExtensionOptimizer = require('../../../../../lib/twing/extension/optimizer');

const tap = require('tap');

tap.test('extension/optimizer', function (test) {
    let extension = new TwingExtensionOptimizer.TwingExtensionOptimizer();

    test.same(Reflect.get(extension, 'optimizers'), -1);

    test.end();
});