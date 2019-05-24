const {TwingNodeCheckSecurity} = require('../../../../../build/node/check-security');
const {TwingCompiler} = require('../../../../../build/compiler');
const {TwingLoaderArray} = require('../../../../../build/loader/array');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../../build/environment/node');

const tap = require('tape');

tap.test('node/check-security', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeCheckSecurity(new Map([['foo', 'bar']]), new Map([['foo', 'bar']]), new Map([['foo', 'bar']]));
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `let tags = new Map([[\`bar\`, null]]);
let filters = new Map([[\`bar\`, null]]);
let functions = new Map([[\`bar\`, null]]);

try {
    this.env.checkSecurity(
        ['bar'],
        ['bar'],
        ['bar']
    );
}
catch (e) {
    if (e instanceof Runtime.TwingSandboxSecurityError) {
        e.setSourceContext(this.source);

        if (e instanceof Runtime.TwingSandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {
            e.setTemplateLine(tags.get(e.getTagName()));
        }
        else if (e instanceof Runtime.TwingSandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {
            e.setTemplateLine(filters.get(e.getFilterName()));
        }
        else if (e instanceof Runtime.TwingSandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {
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