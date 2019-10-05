import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the ternary operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'YES' ?: 'NO' }}
{{ 0 ?: 'NO' }}`
        };
    }

    getExpected() {
        return `
YES
NO
`;
    }
}
