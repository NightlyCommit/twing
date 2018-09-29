const {
    TwingProfilerNodeLeaveProfile,
    TwingCompiler,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeType
} = require('../../../../../../../build/index');

const tap = require('tape');

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
