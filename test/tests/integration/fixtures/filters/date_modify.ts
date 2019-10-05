import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getDescription() {
        return '"date_modify" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date1|date_modify('-1day')|date('Y-m-d H:i:s') }}
{{ date2|date_modify('-1day')|date('Y-m-d H:i:s') }}`
        };
    }

    getExpected() {
        return `
2010-10-03 13:45:00
2010-10-03 13:45:00`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'UTC';

        return {
            date1: '2010-10-04 13:45',
            date2: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'UTC'})
        }
    }
}
