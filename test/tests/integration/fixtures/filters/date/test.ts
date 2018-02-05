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
        DateTimeSettings.defaultZoneName = 'Europe/Paris';

        return {
            date1: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date2: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date3: '2010-10-04 13:45',
            date4: 1286199900,
            date5: -189291360,
            date6: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'America/New_York'}),
            date7: '2010-01-28T15:00:00+04:00',
            timezone1: 'America/New_York',
        }
    }
};