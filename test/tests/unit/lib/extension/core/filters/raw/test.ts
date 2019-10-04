import * as tape from 'tape';
import {raw} from "../../../../../../../../src/lib/extension/core/filters/raw";
import {TwingMarkup} from "../../../../../../../../src/lib/markup";

tape('raw', (test) => {
    test.same(raw('<br/>'), '<br/>');
    test.same(raw(new TwingMarkup('<br/>', 'utf-8')), '<br/>');

    test.end();
});