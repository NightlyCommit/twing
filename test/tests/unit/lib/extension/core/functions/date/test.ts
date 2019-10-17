import * as tape from 'tape';
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";
import {TwingLoaderNull} from "../../../../../../../../src/lib/loader/null";
import {date} from "../../../../../../../../src/lib/extension/core/functions/date";
import {formatDateTime} from "../../../../../../../../src/lib/helpers/format-date-time";
import {DateTime} from "luxon";

const Luxon = require('luxon');

tape('date', async (test) => {
    Luxon.Settings.defaultZoneName = 'UTC';

    let env = new TwingEnvironmentNode(new TwingLoaderNull(), {});

    test.true(await date(env, 'now') instanceof Luxon.DateTime);

    try {
        await date(env, {} as any);

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'Failed to parse date "[object Object]".');
    }

    test.same((await date(env, '2010-01-28T15:00:00', false)).valueOf(), 1264690800000);

    let dateTime: DateTime & {format: (f: string) => string} = (await date(env, '2010-01-28T15:00:00')) as DateTime & {format: (f: string) => string};

    test.same(dateTime.format('H'), formatDateTime(dateTime, 'H'));

    test.end();
});
