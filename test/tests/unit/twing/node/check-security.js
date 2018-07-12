const TwingNodeCheckSecurity = require("../../../../../lib/twing/node/check-security").TwingNodeCheckSecurity;
const TwingCompiler = require("../../../../../lib/twing/compiler").TwingCompiler;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;

const tap = require('tap');

tap.test('node/check-security', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeCheckSecurity(new Map([['foo', 'bar']]), new Map([['foo', 'bar']]), new Map([['foo', 'bar']]));
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `let tags = new Map([[\`bar\`, null]]);
let filters = new Map([[\`bar\`, null]]);
let functions = new Map([[\`bar\`, null]]);

try {
    this.extensions.get('TwingExtensionSandbox').checkSecurity(
        ['bar'],
        ['bar'],
        ['bar']
    );
}
catch (e) {
    if (e instanceof Twing.TwingSandboxSecurityError) {
        e.setSourceContext(this.source);

        if (e instanceof Twing.TwingSandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {
            e.setTemplateLine(tags.get(e.getTagName()));
        }
        else if (e instanceof Twing.TwingSandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {
            e.setTemplateLine(filters.get(e.getFilterName()));
        }
        else if (e instanceof Twing.TwingSandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {
            e.setTemplateLine(functions.get(e.getFunctionName()));
        }
    }

    throw e;
}

`);

        test.end();
    });

    test.end();
});