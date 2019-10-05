import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"batch" filter with zero elements\n';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ []|batch(3)|length }}
{{ []|batch(3, 'fill')|length }}`
        };
    }

    getExpected() {
        return `
0
0
`;
    }
}
