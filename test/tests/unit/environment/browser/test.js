const {TwingEnvironmentBrowser} = require('../../../../../build/environment/browser');
const {TwingCacheNull} = require('../../../../../build/cache/null');

const test = require('tape');

test('browser environment', (test) => {
    test.test('cache from string', (test) => {
        let env = new TwingEnvironmentBrowser(null);

        test.true(env.cacheFromString('foo') instanceof TwingCacheNull, 'should return null cache');

        test.end();
    });

    test.end();
});