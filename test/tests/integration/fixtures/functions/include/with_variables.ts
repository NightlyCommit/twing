import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function accept variables';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("foo.twig", {'foo': 'bar'}) }}
{{- include("foo.twig", vars) }}`,
            'foo.twig': `
{{ foo }}`
        };
    }

    getExpected() {
        return `
bar
bar
`;
    }

    getContext() {
        return {
            vars: {
                foo: 'bar'
            }
        }
    }
}
