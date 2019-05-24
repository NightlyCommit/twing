const {TwingProfilerDumperHtml} = require('../../../../../../build/profiler/dumper/html');
const TwingTestMockBuilderProfile = require('../../../../../mock-builder/profiler/profile');

const tap = require('tape');

tap.test('html profiler dumper', function (test) {
    test.test('dump', function(test) {
        let dumper = new TwingProfilerDumperHtml();

        let matches = dumper.dump(TwingTestMockBuilderProfile.getProfile()).match(new RegExp(`<pre>main <span style="color: #d44">(\\d+)\\.(\\d+)ms\\/(\\d+)%<\\/span>
└ <span style="background-color: #ffd">index\\.twig<\\/span> <span style="color: #d44">(\\d+)\\.(\\d+)ms\\/(\\d+)%<\\/span>
  └ embedded.twig::block\\(<span style="background-color: #dfd">body<\\/span>\\)
  └ <span style="background-color: #ffd">embedded\\.twig<\\/span>
  │ └ <span style="background-color: #ffd">included\\.twig<\\/span>
  └ index.twig::macro\\(<span style="background-color: #ddf">foo<\\/span>\\)
  └ <span style="background-color: #ffd">embedded\\.twig<\\/span>
    └ <span style="background-color: #ffd">included\\.twig<\\/span>
<\\/pre>`));

        test.true(matches);

        test.end();
    });

    test.end();
});