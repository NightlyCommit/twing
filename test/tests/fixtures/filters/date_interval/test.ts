import TwingTestIntegrationTestCase from "../../../../integration-test-case";

import {DateTime, Interval, Settings as DateTimeSettings} from 'luxon';

export = class extends TwingTestIntegrationTestCase {
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
        DateTimeSettings.defaultZoneName = 'UTC';

        let dateLater = new Date(2010, 9, 6, 13, 45, 0);
        let dateEarlier = new Date(2008, 7, 3, 9, 37, 53, 788);

        return {
            date1: Interval.before(new Date(), {
                days: 2
            }),
            date3: Interval.fromDateTimes(dateEarlier, dateLater),
            date4: Interval.fromDateTimes(dateLater, dateEarlier),
            // This should have no effect on DateInterval formatting
            'timezone1': 'America/New_York'
        }
    }
};