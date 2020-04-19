import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'escaped character is rendered as-is in text';
    }

    getTemplates() {
        return {
            'index.twig': 'a\\nb'
        };
    }

    getExpected() {
        return 'a\\nb';
    }
}
