const TwingNodeEmbed = require("../../../../../lib/twing/node/embed").TwingNodeEmbed;
const TwingCompiler = require("../../../../../lib/twing/compiler").TwingCompiler;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingNodeExpressionConstant = require("../../../../../lib/twing/node/expression/constant").TwingNodeExpressionConstant;

const tap = require('tap');

tap.test('node/embed', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeEmbed('foo', 1, new TwingNodeExpressionConstant('bar'), false, false, 1, 'embed');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `// line 1
this.loadTemplate("foo", null, 1, 1).display(Twing.twingArrayMerge(context, "bar"));
`);

        test.end();
    });

    test.end();
});