import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

import {DateTime, Interval as DateTimeInterval, Settings as DateTimeSettings} from 'luxon';

export = class extends TwingTestIntegrationTestCase {
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
        // todo: doesn't seem to work right now, a bug report has been filled
        // https://github.com/moment/luxon/issues/144
        DateTimeSettings.defaultZoneName = 'UTC';

        return {
            date: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'UTC'})
        }
    }
};