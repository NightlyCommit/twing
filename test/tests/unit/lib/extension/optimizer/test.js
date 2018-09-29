const {TwingExtensionOptimizer} = require('../../../../../../dist/index');

const tap = require('tape');

tap.test('extension/optimizer', function (test) {
    let extension = new TwingExtensionOptimizer();

    test.same(Reflect.get(extension, 'optimizers'), -1);

    test.end();
});