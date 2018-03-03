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

        this.twing.getCoreExtension().setDateFormat('Y-m-d', '%d days %h hours');

        return {
            date2: Luxon.Interval.fromDateTimes(
                new Date(2010, 9, 4, 13, 45, 0),
                new Date(2010, 9, 6, 13, 45, 0)
            )
        }
    }
};
