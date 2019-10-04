import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getDescription() {
        return '"date" filter (interval support)';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date2|date }}
{{ date2|date('%d days') }}
`
        };
    }

    getExpected() {
        return `
2 days 0 hours
2 days`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'UTC';

        this.env.getCoreExtension().setDateFormat('Y-m-d', '%d days %h hours');

        return {
            date2: Luxon.Duration.fromObject({
                days: 2
            })
        };
    }
}
