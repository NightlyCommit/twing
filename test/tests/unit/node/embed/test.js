const {TwingNodeEmbed} = require('../../../../../build/node/embed');
const {TwingCompiler} = require('../../../../../build/compiler');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../../build/environment/node');
const {TwingLoaderArray} = require('../../../../../build/loader/array');
const {TwingNodeExpressionConstant} = require('../../../../../build/node/expression/constant');

const tap = require('tape');

tap.test('node/embed', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeEmbed('foo', 1, new TwingNodeExpressionConstant('bar', 1, 1), false, false, 1, 1, 'embed');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
this.loadTemplate(\`foo\`, null, 1, 1).display(this.merge(context, \`bar\`));
`);

        test.end();
    });

    test.end();
});