const {TwingProfilerDumperBlackfire} = require('../../../../../../../build/index');
const TwingTestMockBuilderProfile = require('../../../../../../mock-builder/profiler/profile');

const tap = require('tape');

tap.test('blackfire profiler dumper', function (test) {
    test.test('dump', function(test) {
        let dumper = new TwingProfilerDumperBlackfire();

        let matches = dumper.dump(TwingTestMockBuilderProfile.getProfile()).match(new RegExp(`file-format: BlackfireProbe
cost-dimensions: wt mu pmu
request-start: (\\d+)\\.(\\d+)

main\\(\\)\\/\\/1 (\\d+) (\\d+) (\\d+)
main\\(\\)==>index\\.twig\\/\\/1 (\\d+) (\\d+) (\\d+)
index\\.twig==>embedded\\.twig::block\\(body\\)\\/\\/1 (\\d+) (\\d+) 0
index\\.twig==>embedded\\.twig\\/\\/2 (\\d+) (\\d+) (\\d+)
embedded\\.twig==>included\\.twig\\/\\/2 (\\d+) (\\d+) (\\d+)
index\\.twig==>index\\.twig::macro\\(foo\\)\\/\\/1 (\\d+) (\\d+) (\\d+)`));

        test.true(matches);

        test.end();
    });

    test.end();
});