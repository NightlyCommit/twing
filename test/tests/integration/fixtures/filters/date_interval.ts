import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getDescription() {
        return '"date" filter (interval support)';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date1|date }}
{{ date1|date('%d days %h hours') }}
{{ date1|date('%d days %h hours', timezone1) }}`
        };
    }

    getExpected() {
        return `
2 days
2 days 0 hours
2 days 0 hours
`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'UTC';

        return {
            date1: Luxon.Duration.fromObject({
                days: 2
            }),
            // This should have no effect on DateInterval formatting
            'timezone1': 'America/New_York'
        };
    }
}
