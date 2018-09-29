const {
    TwingEnvironment,
    TwingCacheNull
} = require('../../../../../../build/browser');
const test = require('tape');

test('browser environment', (test) => {
    test.test('cache from string', (test) => {
        let env = new TwingEnvironment(null);

        test.true(env.cacheFromString('foo') instanceof TwingCacheNull, 'should return null cache');

        test.end();
    });

    test.end();
});