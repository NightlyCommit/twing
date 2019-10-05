import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag with non-allowed filter';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ "foo"|upper }}`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}
{%- endsandbox %}
`
        };
    }

    getEnvironmentOptions() {
        return {
            autoescape: false
        }
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFilterError: Filter "upper" is not allowed in "foo.twig" at line 1.';
    }
}
