const {
    TwingExtensionProfiler,
    TwingProfilerProfile,
    TwingProfilerNodeVisitorProfiler
} = require('../../../../../../dist/index');

const tap = require('tape');
const sinon = require('sinon');

tap.test('extension/profiler', function (test) {
    let profile = new TwingProfilerProfile();
    let extension = new TwingExtensionProfiler(profile);

    test.same(Reflect.get(extension, 'actives'), [profile]);

    let profile2 = new TwingProfilerProfile();

    extension.enter(profile2);

    test.same(profile.getProfiles(), [profile2]);
    test.same(Reflect.get(extension, 'actives'), [profile2, profile]);

    test.test('leave', function (test) {
        let stub = sinon.stub(profile, 'leave');

        extension.leave(profile2);

        test.same(Reflect.get(extension, 'actives'), [profile]);

        extension.leave(profile2);

        test.true(stub.calledOnce);

        test.end();
    });

    test.test('getNodeVisitors', function (test) {
        test.same(extension.getNodeVisitors().length, 1);

        test.end();
    });

    test.end();
});