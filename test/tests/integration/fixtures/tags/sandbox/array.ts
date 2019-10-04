import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag support array';
    }

    getTemplates() {
        return {
            'foo.twig': `
{{ [a][0] }}
{{ dump([a][0]) }}
`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}
{%- endsandbox %}
`
        };
    }

    getExpected() {
        return `
b
string(1) "b"
`;
    }


    getEnvironmentOptions() {
        return {
            autoescape: false,
            debug: true
        }
    }

    getContext() {
        return {
            'a': 'b'
        };
    }

    getSandboxSecurityPolicyFunctions() {
        return ['dump'];
    }
}
