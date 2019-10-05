import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"macro" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from 'forms.twig' import foo %}

{{ foo('foo') }}
{{ foo() }}`,
            'forms.twig': `
{% macro foo(name) %}{{ name|default('foo') }}{{ global }}{% endmacro %}`
        };
    }

    getExpected() {
        return `
fooglobal
fooglobal
`;
    }
}
