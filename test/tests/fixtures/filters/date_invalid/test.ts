import TwingTestIntegrationTestCase from "../../../../integration-test-case";

import {Settings as DateTimeSettings} from 'luxon';

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"date" filter with invalid date';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Failed to parse date "2010 -01-28T15:00:00+04:00" in "index.twig" at line 2.';
    }

    getData() {
        DateTimeSettings.defaultZoneName = 'Europe/Paris';

        return {
            date1: '2010 -01-28T15:00:00+04:00'
        }
    }
};