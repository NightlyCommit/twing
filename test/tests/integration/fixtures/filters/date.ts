import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getDescription() {
        return '"date" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date1|date }}
{{ date1|date('d/m/Y') }}
{{ date1|date('d/m/Y H:i:s', 'Asia/Hong_Kong') }}
{{ date1|date('d/m/Y H:i:s P', 'Asia/Hong_Kong') }}
{{ date1|date('d/m/Y H:i:s P', 'America/Chicago') }}
{{ date1|date('e') }}
{{ date1|date('d/m/Y H:i:s') }}

{{ date2|date }}
{{ date2|date('d/m/Y') }}
{{ date2|date('d/m/Y H:i:s', 'Asia/Hong_Kong') }}
{{ date2|date('d/m/Y H:i:s', timezone1) }}
{{ date2|date('d/m/Y H:i:s') }}

{{ date3|date }}
{{ date3|date('d/m/Y') }}

{{ date4|date }}
{{ date4|date('d/m/Y') }}

{{ date5|date }}
{{ date5|date('d/m/Y') }}

{{ date6|date('d/m/Y H:i:s P', 'Europe/Paris') }}
{{ date6|date('d/m/Y H:i:s P', 'Asia/Hong_Kong') }}
{{ date6|date('d/m/Y H:i:s P', false) }}
{{ date6|date('e', 'Europe/Paris') }}
{{ date6|date('e', false) }}

{{ date7|date }}
{{ date7|date(timezone='Europe/Paris') }}
{{ date7|date(timezone='Asia/Hong_Kong') }}
{{ date7|date(timezone=false) }}
{{ date7|date(timezone='Indian/Mauritius') }}

{{ '2010-01-28 15:00:00'|date(timezone="Europe/Paris") }}
{{ '2010-01-28 15:00:00'|date(timezone="Asia/Hong_Kong") }}`
        };
    }

    getExpected() {
        return `
October 4, 2010 13:45
04/10/2010
04/10/2010 19:45:00
04/10/2010 19:45:00 +08:00
04/10/2010 06:45:00 -05:00
Europe/Paris
04/10/2010 13:45:00

October 4, 2010 13:45
04/10/2010
04/10/2010 19:45:00
04/10/2010 07:45:00
04/10/2010 13:45:00

October 4, 2010 13:45
04/10/2010

October 4, 2010 15:45
04/10/2010

January 2, 1964 04:04
02/01/1964

04/10/2010 19:45:00 +02:00
05/10/2010 01:45:00 +08:00
04/10/2010 13:45:00 -04:00
Europe/Paris
America/New_York

January 28, 2010 12:00
January 28, 2010 12:00
January 28, 2010 19:00
January 28, 2010 15:00
January 28, 2010 15:00

January 28, 2010 15:00
January 28, 2010 22:00
`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'Europe/Paris';

        return {
            date1: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date2: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date3: '2010-10-04 13:45',
            date4: 1286199900,
            date5: -189291360,
            date6: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'America/New_York'}),
            date7: '2010-01-28T15:00:00+04:00',
            timezone1: 'America/New_York',
        }
    }
}
