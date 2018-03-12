const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

let Luxon = require('luxon');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"date" filter (interval support)';
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

        return {
            date1: Luxon.Duration.fromObject({
                days: 2
            }),
            // This should have no effect on DateInterval formatting
            'timezone1': 'America/New_York'
        };
    }
};
