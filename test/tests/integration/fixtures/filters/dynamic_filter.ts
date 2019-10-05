import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'dynamic filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'bar'|foo_path }}
{{ 'bar'|a_foo_b_bar }}`
        };
    }

    getExpected() {
        return `
foo/bar
a/b/bar
`;
    }
}
