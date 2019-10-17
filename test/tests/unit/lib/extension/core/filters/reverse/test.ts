import * as tape from "tape";
import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import {reverse} from "../../../../../../../../src/lib/extension/core/filters/reverse";

tape('reverse', (test) => {
    test.test('on non-UTF-8 string', async (test) => {
        let twing = new MockEnvironment(new MockLoader());
        twing.setCharset('ISO-8859-1');

        test.same(await reverse(twing, 'Äé'), 'éÄ');

        test.end();
    });

    test.test('on UTF-8 string', async (test) => {
        let twing = new MockEnvironment(new MockLoader());

        test.same(await reverse(twing, 'évènement'), 'tnemenèvé');

        test.end();
    });

    test.end();
});
