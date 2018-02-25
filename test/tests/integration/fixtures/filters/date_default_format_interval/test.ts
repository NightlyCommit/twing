import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

import {Interval, Settings as DateTimeSettings} from 'luxon';

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

        this.twing.getCoreExtension().setDateFormat('Y-m-d', '%d days %h hours');

        return {
            date2: Interval.fromDateTimes(
                new Date(2010, 9, 4, 13, 45, 0),
                new Date(2010, 9, 6, 13, 45, 0)
            )
        }
    }
};
