import TwingTestIntegrationTestCase from "../../../../../integration-test-case";
import {DateTime, Settings as DateTimeSettings} from "luxon";

export = class extends TwingTestIntegrationTestCase {
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
        DateTimeSettings.defaultZoneName = 'UTC';

        return {
            date1: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date2: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45}),
            date3: '2010-10-04 13:45',
            date4: 1286199900, // DateTime::createFromFormat('Y-m-d H:i', '2010-10-04 13:45', new DateTimeZone('UTC'))->getTimestamp() -- A unixtimestamp is always GMT
            date5: -189291360, // DateTime::createFromFormat('Y-m-d H:i', '1964-01-02 03:04', new DateTimeZone('UTC'))->getTimestamp()
        }
    }
};