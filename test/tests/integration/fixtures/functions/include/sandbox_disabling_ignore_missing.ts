import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag sandboxed with ignore missing set to true and "include" tag with sandbox disabled';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("unknown.twig", sandboxed = true, ignore_missing = true) }}
{{ include("bar.twig") }}
`,
            'bar.twig': `
{{ foo|e }}
`
        };
    }

    getExpected() {
        return `


bar&lt;br /&gt;
`;
    }

    getContext() {
        return {
            foo: 'bar<br />'
        }
    }
}
