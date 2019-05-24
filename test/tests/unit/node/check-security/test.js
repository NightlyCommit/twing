const {TwingNodeCheckSecurity} = require('../../../../../build/node/check-security');
const {TwingCompiler} = require('../../../../../build/compiler');
const {TwingLoaderArray} = require('../../../../../build/loader/array');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../../build/environment/node');

const tap = require('tape');

tap.test('node/check-security', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeCheckSecurity(new Map([['foo', 'bar']]), new Map([['foo', 'bar']]), new Map([['foo', 'bar']]));
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), 'this.env.checkSecurity(new Map([[`bar`, null]]), new Map([[`bar`, null]]), new Map([[`bar`, null]]));\n\n');

        test.end();
    });

    test.end();
});