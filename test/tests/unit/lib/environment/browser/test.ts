import * as tape from 'tape';
import {TwingEnvironmentBrowser} from "../../../../../../src/lib/environment/browser";
import {TwingCacheNull} from "../../../../../../src/lib/cache/null";

tape('browser environment', (test) => {
    test.test('cache from string', (test) => {
        let env = new TwingEnvironmentBrowser(null);

        test.true(env.cacheFromString('foo') instanceof TwingCacheNull, 'should return null cache');

        test.end();
    });

    test.end();
});