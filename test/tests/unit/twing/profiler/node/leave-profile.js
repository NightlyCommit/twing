const TwingProfilerNodeLeaveProfile = require('../../../../../../lib/twing/profiler/node/leave-profile').TwingProfilerNodeLeaveProfile;
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingNodeType = require('../../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('profiler/node/leave-profile', function (test) {
    test.test('constructor', function(test) {
        test.equals(new TwingProfilerNodeLeaveProfile('varName').getType(), TwingNodeType.PROFILER_LEAVE_PROFILE);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingProfilerNodeLeaveProfile('varName');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `
varName.leave(varNameProf);

`);

        test.end();
    });

    test.end();
});
