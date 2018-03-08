const TwingProfilerDumperHtml = require('../../../../../../lib/twing/profiler/dumper/html').TwingProfilerDumperHtml;
const TwingTestMockBuilderProfile = require('../../../../../mock-builder/profiler/profile');

const tap = require('tap');

tap.test('html profiler dumper', function (test) {
    test.test('dump', function(test) {
        let dumper = new TwingProfilerDumperHtml();

        test.matches(dumper.dump(TwingTestMockBuilderProfile.getProfile()), new RegExp(`<pre>main <span style="color: #d44">(\\d+)\\.(\\d+)ms\\/(\\d+)%<\\/span>
└ <span style="background-color: #ffd">index\\.twig<\\/span> <span style="color: #d44">(\\d+)\\.(\\d+)ms\\/(\\d+)%<\\/span>
  └ embedded.twig::block\\(<span style="background-color: #dfd">body<\\/span>\\)
  └ <span style="background-color: #ffd">embedded\\.twig<\\/span>
  │ └ <span style="background-color: #ffd">included\\.twig<\\/span>
  └ index.twig::macro\\(<span style="background-color: #ddf">foo<\\/span>\\)
  └ <span style="background-color: #ffd">embedded\\.twig<\\/span>
    └ <span style="background-color: #ffd">included\\.twig<\\/span>
<\\/pre>`));

        test.end();
    });

    test.end();
});