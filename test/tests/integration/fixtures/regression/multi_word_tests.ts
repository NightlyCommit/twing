import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twig allows multi-word tests without a custom node class';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'foo' is multi word ? 'yes' : 'no' }}
{{ 'foo bar' is multi word ? 'yes' : 'no' }}`
        };
    }

    getExpected() {
        return `
no
yes
`;
    }
}
