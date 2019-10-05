import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'file1.html.twig': `
{% block foo -%}
    Content of foo
{% endblock foo %}
{% block bar -%}
    Content of bar
{% endblock bar %}`,
            'file2.html.twig': `
{% use 'file1.html.twig' %}
{% block foo %}
    {{- parent() -}}
    Content of foo (first override)
{% endblock foo %}
{% block bar %}
    {{- parent() -}}
    Content of bar (first override)
{% endblock bar %}`,
            'index.twig': `
{% use 'file2.html.twig' %}
{% use 'file1.html.twig' with foo %}
{% block foo %}
    {{- parent() -}}
    Content of foo (second override)
{% endblock foo %}
{% block bar %}
    {{- parent() -}}
    Content of bar (second override)
{% endblock bar %}`
        };
    }

    getExpected() {
        return `
Content of foo
Content of foo (first override)
Content of foo (second override)
Content of bar
Content of bar (second override)
`;
    }

}
