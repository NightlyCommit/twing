import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'file1.html.twig': `
{% block foobar -%}
    Content of block
{% endblock foobar %}`,
            'file2.html.twig': `
{% use 'file1.html.twig' %}
{% block foobar %}
    {{- parent() -}}
    Content of block (first override)
{% endblock foobar %}`,
            'index.twig': `
{% use 'file2.html.twig'%}
{% block foobar %}
    {{- parent() -}}
    Content of block (second override)
{% endblock foobar %}`
        };
    }

    getExpected() {
        return `
Content of block
Content of block (first override)
Content of block (second override)
`;
    }

}
