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
            date: DateTime.fromObject({year: 2010, month: 10, day: 4, hour: 13, minute: 45})
        }
    }
};