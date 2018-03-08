const TwingProfilerDumperText = require('../../../../../../lib/twing/profiler/dumper/text').TwingProfilerDumperText;
const TwingTestMockBuilderProfile = require('../../../../../mock-builder/profiler/profile');

const tap = require('tap');

tap.test('text profiler dumper', function (test) {
    test.test('dump', function(test) {
        let dumper = new TwingProfilerDumperText();

        test.matches(dumper.dump(TwingTestMockBuilderProfile.getProfile()), new RegExp(`main (\\d+)\\.(\\d+)ms\\/(\\d+)%
└ index\\.twig (\\d+)\\.(\\d+)ms\\/(\\d+)%
  └ embedded\\.twig::block\\(body\\)
  └ embedded\\.twig
  │ └ included\\.twig
  └ index\\.twig::macro\\(foo\\)
  └ embedded\\.twig
    └ included\\.twig`));

        test.end();
    });

    test.end();
});