import TestBase from "../../TestBase";

let Luxon = require('luxon');

export default class extends TestBase {
    getName() {
        return 'filters/date_invalid';
    }

    getDescription() {
        return '"date" filter with invalid date';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ date1|date }}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Failed to parse date "2010 -01-28T15:00:00+04:00" in "index.twig" at line 2.';
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'Europe/Paris';

        return {
            date1: '2010 -01-28T15:00:00+04:00'
        }
    }
}
