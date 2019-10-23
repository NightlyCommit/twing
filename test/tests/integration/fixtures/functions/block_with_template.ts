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

    async getContext() {
        return {
            included_loaded: await this.env.load('included.twig'),
            included_loaded_internal: await this.env.loadTemplate('included.twig')
        }
    }
}
