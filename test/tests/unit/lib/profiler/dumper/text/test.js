const {TwingProfilerDumperText} = require('../../../../../../../dist/index');
const TwingTestMockBuilderProfile = require('../../../../../../mock-builder/profiler/profile');

const tap = require('tape');

tap.test('text profiler dumper', function (test) {
    test.test('dump', function(test) {
        let dumper = new TwingProfilerDumperText();

        let matches = dumper.dump(TwingTestMockBuilderProfile.getProfile()).match(new RegExp(`main (\\d+)\\.(\\d+)ms\\/(\\d+)%
└ index\\.twig (\\d+)\\.(\\d+)ms\\/(\\d+)%
  └ embedded\\.twig::block\\(body\\)
  └ embedded\\.twig
  │ └ included\\.twig
  └ index\\.twig::macro\\(foo\\)
  └ embedded\\.twig
    └ included\\.twig`));

        test.true(matches);

        test.end();
    });

    test.end();
});