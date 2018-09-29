const {TwingFactoryRuntimeLoader} = require("../../../../../build/index");

const tap = require('tape');

tap.test('factory-runtime-loader', function (test) {
    test.test('load', function (test) {
        let loader = new TwingFactoryRuntimeLoader(new Map([['stdClass', getRuntime]]));

        test.true(loader.load('stdClass') instanceof Object);

        test.end();
    });

    test.test('loadReturnsNullForUnmappedRuntime', function (test) {
        let loader = new TwingFactoryRuntimeLoader();

        test.false(loader.load('stdClass'));

        test.end();
    });

    test.end();
});

function getRuntime() {
    return {};
}