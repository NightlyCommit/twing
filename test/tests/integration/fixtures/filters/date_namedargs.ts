import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getDescription() {
        return '"date" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date|date(format='d/m/Y H:i:s P', timezone='America/Chicago') }}
{{ date|date(timezone='America/Chicago', format='d/m/Y H:i:s P') }}
{{ date|date('d/m/Y H:i:s P', timezone='America/Chicago') }}`
        };
    }

    getExpected() {
        return `
04/10/2010 08:45:00 -05:00
04/10/2010 08:45:00 -05:00
04/10/2010 08:45:00 -05:00
`;
    }

    getContext() {
        // todo: doesn't seem to work right now, a bug report has been filled
        // https://github.com/moment/luxon/issues/144
        Luxon.Settings.defaultZoneName = 'UTC';

        return {
            date: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'UTC'})
        }
    }
}
