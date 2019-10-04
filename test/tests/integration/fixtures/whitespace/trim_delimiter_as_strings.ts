import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Whitespace trimming as strings.';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 5 * '{#-'|length }}
{{ '{{-'|length * 5 + '{%-'|length }}
`
        };
    }

    getExpected() {
        return `
15
18
`;
    }
}
