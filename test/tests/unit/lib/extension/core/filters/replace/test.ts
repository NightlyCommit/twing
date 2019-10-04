import * as tape from 'tape';
import {replace} from "../../../../../../../../src/lib/extension/core/filters/replace";

tape('replace', (test) => {
    test.same(replace('foo', null), 'foo');

    test.end();
});
