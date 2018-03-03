const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

let Luxon = require('luxon');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"date" filter';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        Luxon.Settings.defaultZoneName = 'UTC';

        this.twing.getCoreExtension().setDateFormat('Y-m-d', '%d days %h hours');

        return {
            date1: new Date(2010, 9, 4, 13, 45, 0)
        }
    }
};
