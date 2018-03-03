const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const Luxon = require('luxon');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"date" function';
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
            date: Luxon.DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45})
        }
    }
};
