import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"block" function with a template argument';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ block('foo', 'included.twig') }}
{{ block('foo', included_loaded) }}
{{ block('foo', included_loaded_internal) }}
{% set output = block('foo', 'included.twig') %}
{{ output }}
{% block foo %}NOT FOO{% endblock %}`,
            'included.twig': `
{% block foo %}FOO{% endblock %}`
        };
    }

    getExpected() {
        return `
FOO
FOO
FOO
FOO
NOT FOO
`;
    }

    getContext() {
        return {
            included_loaded: this.env.load('included.twig'),
            included_loaded_internal: this.env.loadTemplate('included.twig')
        }
    }
}
