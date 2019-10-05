import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag with non-allowed function';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ dump() }}`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}
{%- endsandbox %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFunctionError: Function "dump" is not allowed in "foo.twig" at line 1.';
    }
}
