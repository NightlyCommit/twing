const tap = require('tape');
const {TwingProfilerNodeEnterProfile} = require("../../../../../../build/profiler/node/enter-profile");
const {TwingNodeType} = require("../../../../../../build/node");
const {TwingCompiler} = require("../../../../../../build/compiler");
const {TwingEnvironmentNode: TwingEnvironment} = require("../../../../../../build/environment/node");
const {TwingLoaderArray} = require("../../../../../../build/loader/array");

tap.test('profiler/node/enter-profile', function (test) {
    test.test('constructor', function(test) {
        test.equals(new TwingProfilerNodeEnterProfile('extensionName', 'type', 'name', 'varName').getType(), TwingNodeType.PROFILER_ENTER_PROFILE);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingProfilerNodeEnterProfile('extensionName', 'type', 'name', 'varName');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `let varName = this.extensions.get(\`extensionName\`);
let varNameProf = new Runtime.TwingProfilerProfile(this.getTemplateName(), \`type\`, \`name\`);
varName.enter(varNameProf);

`);

        test.end();
    });

    test.end();
});
