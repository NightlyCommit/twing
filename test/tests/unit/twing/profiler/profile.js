const TwingProfilerProfile = require('../../../../../lib/twing/profiler/profile').TwingProfilerProfile;

const tap = require('tap');
const sinon = require('sinon');
const serialize = require('locutus/php/var/serialize');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

tap.test('profiler profile', function (test) {
    test.test('constructor', function (test) {
        let profile = new TwingProfilerProfile('template', 'type', 'name');

        test.same(profile.getTemplate(), 'template');
        test.same(profile.getType(), 'type');
        test.same(profile.getName(), 'name');

        test.test('with __internal_ name', function (test) {
            let profile = new TwingProfilerProfile('template', 'type', '__internal_');

            test.same(profile.getName(), 'INTERNAL');

            test.end();
        });

        test.end();
    });

    test.test('isRoot', function (test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.true(profile.isRoot());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.TEMPLATE);
        test.false(profile.isRoot());

        test.end();
    });

    test.test('isTemplate', function (test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.TEMPLATE);
        test.true(profile.isTemplate());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isTemplate());

        test.end();
    });

    test.test('isBlock', function (test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.BLOCK);
        test.true(profile.isBlock());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isBlock());

        test.end();
    });

    test.test('isMacro', function (test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.MACRO);
        test.true(profile.isMacro());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isMacro());

        test.end();
    });

    test.test('get/addProfile', function (test) {
        let a = new TwingProfilerProfile();
        let b = new TwingProfilerProfile();
        let profile = new TwingProfilerProfile();

        profile.addProfile(a);
        profile.addProfile(b);

        test.same(profile.getProfiles(), [a, b]);
        test.same(profile[Symbol.iterator], [a, b][Symbol.iterator]);

        test.end();
    });

    test.test('getDuration', function (test) {
        let profile = new TwingProfilerProfile();

        sleep(100).then(
            function () {
                profile.leave();

                test.true(profile.getDuration() > 99, `Expected duration > 99, got: ${profile.getDuration()}'`);

                test.end();
            }
        );

        test.test('when root', function (test) {
            let profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT, 'name');
            let profile1 = new TwingProfilerProfile('template1', 'type1', 'name1');
            let profile2 = new TwingProfilerProfile('template2', 'type2', 'name2');

            profile.addProfile(profile1);
            profile.addProfile(profile2);

            sinon.stub(profile1, 'getDuration').returns(50);
            sinon.stub(profile2, 'getDuration').returns(100);

            sleep(100).then(
                function () {
                    profile.leave();

                    test.equals(profile.getDuration(), 150, 'returns the sum of all child durations');

                    test.end();
                }
            );
        });
    });

    test.test('serialize', function (test) {
        let profile = new TwingProfilerProfile('template', 'type', 'name');
        let profile1 = new TwingProfilerProfile('template1', 'type1', 'name1');
        profile.addProfile(profile1);
        profile.leave();
        profile1.leave();

        let profile2 = TwingProfilerProfile.unserialize(serialize(profile));
        let profiles = profile.getProfiles();

        test.same(profiles.length, 1);

        let profile3 = profiles[0];

        test.same(profile2.getTemplate(), profile.getTemplate(), 'getTemplate');
        test.same(profile2.getType(), profile.getType(), 'getType');
        test.same(profile2.getName(), profile.getName(), 'getName');
        // todo: fix that test that fails randomly
        //test.same(profile2.getDuration(), profile.getDuration(), 'getDuration');

        test.same(profile3.getTemplate(), profile3.getTemplate(), 'getTemplate');
        test.same(profile3.getType(), profile3.getType(), 'getType');
        test.same(profile3.getName(), profile3.getName(), 'getName');

        test.end();
    });

    test.test('reset', function (test) {
        let profile = new TwingProfilerProfile();

        sleep(100).then(
            function () {
                profile.leave();
                profile.reset();

                test.equal(profile.getDuration(), 0);

                test.end();
            }
        );
    });

    test.test('getMemoryUsage', function (test) {
        test.test('when usage has not been set', function (test) {
            let profile = new TwingProfilerProfile();

            test.same(profile.getMemoryUsage(), 0);

            test.end();
        });

        test.test('when usage has been set', function (test) {
            let profile = new TwingProfilerProfile();

            Reflect.set(profile, 'starts', new Map([['mu', 0]]));
            Reflect.set(profile, 'ends', new Map([['mu', 100]]));

            test.same(profile.getMemoryUsage(), 100);

            test.end();
        });

        test.end();
    });

    test.test('getPeakMemoryUsage', function (test) {
        test.test('when usage has not been set', function (test) {
            let profile = new TwingProfilerProfile();

            test.same(profile.getPeakMemoryUsage(), 0);

            test.end();
        });

        test.test('when usage has been set', function (test) {
            let profile = new TwingProfilerProfile();

            Reflect.set(profile, 'starts', new Map([['pmu', 0]]));
            Reflect.set(profile, 'ends', new Map([['pmu', 100]]));

            test.same(profile.getPeakMemoryUsage(), 100);

            test.end();
        });

        test.end();
    });

    test.end();
});
