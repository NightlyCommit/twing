const TwingProfilerNodeEnterProfile = require('../../../../../../lib/twing/profiler/node/enter-profile').TwingProfilerNodeEnterProfile;
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingNodeType = require('../../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('profiler/node/enter-profile', function (test) {
    test.test('constructor', function(test) {
        test.equals(new TwingProfilerNodeEnterProfile('extensionName', 'type', 'name', 'varName').getType(), TwingNodeType.PROFILER_ENTER_PROFILE);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingProfilerNodeEnterProfile('extensionName', 'type', 'name', 'varName');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `let varName = this.extensions.get("extensionName");
let varNameProf = new Twing.TwingProfilerProfile(this.getTemplateName(), "type", "name");
varName.enter(varNameProf);

`);

        test.end();
    });

    test.end();
});
