import * as tape from 'tape';
import {striptags} from "../../../../../../../../src/lib/extension/core/filters/striptags";

tape('striptags', (test) => {
    test.same(striptags('<br/>'), '');

    test.end();
});