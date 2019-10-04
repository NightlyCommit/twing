import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag sandboxed "include" tag with sandbox disabled';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("foo.twig", sandboxed = true) }}
{{ include("bar.twig") }}`,
            'foo.twig': `
foo
`,
            'bar.twig': `
{{ foo|e }}`
        };
    }

    getExpected() {
        return `
foo


bar&lt;br /&gt;
`;
    }

    getContext() {
        return {
            foo: 'bar<br />'
        }
    }
}
