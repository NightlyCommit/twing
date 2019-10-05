import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"macro" tag';
    }

    getTemplates() {
        return {
            'forms.twig': `
{% macro foo(name) %}foo{{ name }}{% endmacro %}
{% macro bar(name) %}bar{{ name }}{% endmacro %}`,
            'index.twig': `
{% from 'forms.twig' import foo %}
{% from 'forms.twig' import foo as foobar, bar %}

{{ foo('foo') }}
{{ foobar('foo') }}
{{ bar('foo') }}`
        };
    }

    getExpected() {
        return `
foofoo
foofoo
barfoo
`;
    }

}
