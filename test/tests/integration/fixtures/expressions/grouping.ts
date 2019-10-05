import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports grouping of expressions';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ (2 + 2) / 2 }}`
        };
    }

    getExpected() {
        return `
2
`;
    }
}
