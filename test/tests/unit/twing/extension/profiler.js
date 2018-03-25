const TwingExtensionProfiler = require('../../../../../lib/twing/extension/profiler');
const TwingProfilerProfile = require('../../../../../lib/twing/profiler/profile').TwingProfilerProfile;
const TwingProfilerNodeVisitorProfiler = require('../../../../../lib/twing/profiler/node-visitor/profiler').TwingProfilerNodeVisitorProfiler;

const tap = require('tap');
const sinon = require('sinon');

tap.test('extension/profiler', function (test) {
    let profile = new TwingProfilerProfile();
    let extension = new TwingExtensionProfiler.TwingExtensionProfiler(profile);

    test.same(Reflect.get(extension, 'actives'), [profile]);

    let profile2 = new TwingProfilerProfile();

    extension.enter(profile2);

    test.same(profile.getProfiles(), [profile2]);
    test.same(Reflect.get(extension, 'actives'), [profile2, profile]);

    test.test('leave', function(test) {
        let stub = sinon.stub(profile, 'leave');

        extension.leave(profile2);

        test.same(Reflect.get(extension, 'actives'), [profile]);

        extension.leave(profile2);

        test.true(stub.calledOnce);

        test.end();
    });

    test.test('getNodeVisitors', function(test) {
        test.same(extension.getNodeVisitors(), [new TwingProfilerNodeVisitorProfiler('TwingExtensionProfiler')])

       test.end();
    });

    test.end();
});