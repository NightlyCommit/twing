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
{%- endsandbox %}

{%- sandbox %}
    {%- include "foo.twig" %}
    {%- include "foo.twig" %}
{%- endsandbox %}

{%- sandbox %}{% include "foo.twig" %}{% endsandbox %}`
        };
    }

    getExpected() {
        return `
foo
foo
foo
foo
`;
    }

}
