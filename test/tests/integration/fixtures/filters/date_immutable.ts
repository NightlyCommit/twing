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
{{ date1|date('d/m/Y H:i:s', timezone1) }}
{{ date1|date('d/m/Y H:i:s') }}
{{ date1|date_modify('+1 hour')|date('d/m/Y H:i:s') }}

{{ date2|date('d/m/Y H:i:s P', 'Europe/Paris') }}
{{ date2|date('d/m/Y H:i:s P', 'Asia/Hong_Kong') }}
{{ date2|date('d/m/Y H:i:s P', false) }}
{{ date2|date('e', 'Europe/Paris') }}
{{ date2|date('e', false) }}
`
        };
    }

    getExpected() {
        return `
October 4, 2010 13:45
04/10/2010
04/10/2010 19:45:00
04/10/2010 07:45:00
04/10/2010 13:45:00
04/10/2010 14:45:00

04/10/2010 19:45:00 +02:00
05/10/2010 01:45:00 +08:00
04/10/2010 13:45:00 -04:00
Europe/Paris
America/New_York
`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'Europe/Paris';

        return {
            date1: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date2: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'America/New_York'}),
            timezone1: 'America/New_York',
        }
    }
}
