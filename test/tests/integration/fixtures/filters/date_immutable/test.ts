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
            date2: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45, zone: 'America/New_York'}),
            timezone1: 'America/New_York',
        }
    }
};