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
{{ date1|date('d/m/Y') }}`
        };
    }

    getExpected() {
        return `
2010-10-04
04/10/2010`;
    }

    getContext() {
        Luxon.Settings.defaultZoneName = 'UTC';

        this.env.getCoreExtension().setDateFormat('Y-m-d', '%d days %h hours');

        return {
            date1: new Date(2010, 9, 4, 13, 45, 0)
        };
    }
}
