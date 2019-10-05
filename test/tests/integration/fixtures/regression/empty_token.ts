import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twig outputs 0 nodes correctly';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ foo }}0{{ foo }}`
        };
    }

    getExpected() {
        return `
foo0foo
`;
    }

    getContext() {
        return {
            foo: 'foo'
        }
    }
}
