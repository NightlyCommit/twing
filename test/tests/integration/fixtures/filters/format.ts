import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"format" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ string|format(foo, 3) }}`
        };
    }

    getExpected() {
        return `
bar/3
`;
    }

    getContext() {
        return {
            string: '%s/%d',
            foo: 'bar'
        }
    }
}
