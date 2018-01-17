import {Test} from "tape";
import TwingLoaderFilesystem from "../../../src/loader/filesystem";
import TwingErrorLoader from "../../../src/error/loader";
import TwingEnvironment from "../../../src/environment";
import TwingProfilerProfile from "../../../src/profiler/profile";

const tap = require('tap');

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

tap.test('profiler profile', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let profile = new TwingProfilerProfile('template', 'type', 'name');

        test.same(profile.getTemplate(), 'template');
        test.same(profile.getType(), 'type');
        test.same(profile.getName(), 'name');

        test.end();
    });

    test.test('isRoot', function (test: Test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.true(profile.isRoot());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.TEMPLATE);
        test.false(profile.isRoot());

        test.end();
    });

    test.test('isTemplate', function (test: Test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.TEMPLATE);
        test.true(profile.isTemplate());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isTemplate());

        test.end();
    });

    test.test('isBlock', function (test: Test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.BLOCK);
        test.true(profile.isBlock());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isBlock());

        test.end();
    });

    test.test('isMacro', function (test: Test) {
        let profile = new TwingProfilerProfile('template', TwingProfilerProfile.MACRO);
        test.true(profile.isMacro());

        profile = new TwingProfilerProfile('template', TwingProfilerProfile.ROOT);
        test.false(profile.isMacro());

        test.end();
    });

    test.test('get/addProfile', function (test: Test) {
        let a = new TwingProfilerProfile();
        let b = new TwingProfilerProfile();
        let profile = new TwingProfilerProfile();

        profile.addProfile(a);
        profile.addProfile(b);

        test.same(profile.getProfiles(), [a, b]);
        test.same(profile[Symbol.iterator], [a, b][Symbol.iterator]);

        test.end();
    });

    test.test('getDuration', async function (test: Test) {
        let profile = new TwingProfilerProfile();

        await sleep(100).then(
            function () {
                profile.leave();

                test.true(profile.getDuration() > 99, `Expected duration > 99, got: ${profile.getDuration()}'`);

                test.end();
            }
        );
    });

    test.test('reset', async function (test: Test) {
        let profile = new TwingProfilerProfile();

        await sleep(100).then(
            function () {
                profile.leave();
                profile.reset();

                test.equal(profile.getDuration(), 0);

                test.end();
            }
        );
    });

    test.end();
});