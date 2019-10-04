import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag with non-allowed tag';
    }

    getTemplates() {
        return {
            'foo.twig': `{% do 1 + 2 %}`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}
{%- endsandbox %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedTagError: Tag "do" is not allowed in "foo.twig" at line 1.';
    }
}
