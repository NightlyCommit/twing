const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

let Luxon = require('luxon');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'filters/date_invalid';
    }

    getDescription() {
        return '"date" filter with invalid date';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Failed to parse date "2010 -01-28T15:00:00+04:00" in "index.twig" at line 2.';
    }

    getData() {
        Luxon.Settings.defaultZoneName = 'Europe/Paris';

        return {
            date1: '2010 -01-28T15:00:00+04:00'
        }
    }
};
