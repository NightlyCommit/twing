import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag';
    }

    getTemplates() {
        return {
            'foo.twig': `
foo`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}

    {% if 1 %}
        {%- include "foo.twig" %}
    {% endif %}
{%- endsandbox %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Only "include" tags are allowed within a "sandbox" section in "index.twig" at line 5.'
    }
}
