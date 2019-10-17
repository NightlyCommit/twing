import TestBase from "../../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../../src/lib/environment-options";

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

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            autoescape: false
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
