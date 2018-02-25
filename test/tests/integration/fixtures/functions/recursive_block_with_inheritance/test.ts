import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"block" function recursively called in a parent template';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('ordered_menu.twig', require('./ordered_menu.twig'));
        templates.set('base.twig', require('./base.twig'));
        templates.set('menu.twig', require('./menu.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getConfig() {
        return {
            debug: true
        }
    }

    getData() {
        return {
            item: ['1', '2', ['3.1', ['3.2.1', '3.2.2'], '3.4']]
        }
    }
};