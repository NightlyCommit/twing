import * as tape from 'tape';
import {urlEncode} from "../../../../../../../../src/lib/extension/core/filters/url-encode";

tape('url-encode', async (test) => {
    test.same(await urlEncode(5), '');

    test.end();
});
