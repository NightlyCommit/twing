const {
    TwingProfilerDumperBase,
    TwingProfilerProfile
} = require('../../../../../../../build/index');

const tap = require('tape');
const sinon = require('sinon');

class Dumper extends TwingProfilerDumperBase {
    formatTemplate(profile, prefix) {
        return '';
    }

    formatNonTemplate(profile, prefix) {
        return '';
    }

    formatTime(profile, prefix)  {
        return '';
    }
}

tap.test('profiler/dumper/base', function (test) {
    test.test('dumpProfile', function(test) {
        test.test('when profile duration is zero', function(test) {
            let dumper = new Dumper();
            let dumpProfile = Reflect.get(dumper, 'dumpProfile').bind(dumper);
            let profile = new TwingProfilerProfile();

            sinon.stub(profile, 'getDuration').returns(0);

            test.same(dumpProfile(profile), 'main\n');

            test.end();
        });

        test.end();
    });

    test.end();
});