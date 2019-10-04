import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the ternary operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 ? 'YES' }}
{{ 0 ? 'YES' }}`
        };
    }

    getExpected() {
        return `
YES

`;
    }
}
