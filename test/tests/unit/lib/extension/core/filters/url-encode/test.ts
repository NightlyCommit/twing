import * as tape from 'tape';
import {urlEncode} from "../../../../../../../../src/lib/extension/core/filters/url-encode";

tape('url-encode', (test) => {
    test.same(urlEncode(5), '');

    test.end();
});
