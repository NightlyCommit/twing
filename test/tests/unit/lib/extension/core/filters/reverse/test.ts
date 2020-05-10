import * as tape from "tape";
import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import {reverse} from "../../../../../../../../src/lib/extension/core/filters/reverse";
import {MockTemplate} from "../../../../../../../mock/template";

tape('reverse', (test) => {
    test.test('on non-UTF-8 string', async (test) => {
        test.same(await reverse('Äé'), 'éÄ');

        test.end();
    });

    test.test('on UTF-8 string', async (test) => {
        test.same(await reverse('évènement'), 'tnemenèvé');

        test.end();
    });

    test.end();
});
