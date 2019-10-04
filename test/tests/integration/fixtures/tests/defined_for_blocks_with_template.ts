import TestBase from "../../TestBase";

export default class extends TestBase {
    getName() {
        return 'tests/defined_for_blocks_with_template';
    }

    getDescription() {
        return '"defined" support for blocks with a template argument';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ block('foo', 'included.twig') is defined ? 'ok' : 'ko' }}
{{ block('foo', included_loaded) is defined ? 'ok' : 'ko' }}
{{ block('foo', included_loaded_internal) is defined ? 'ok' : 'ko' }}`,
            'included.twig': `
{% block foo %}FOO{% endblock %}`
        };
    }

    getExpected() {
        return `
ok
ok
ok
`;
    }

    getContext() {
        return {
            included_loaded: this.env.load('included.twig'),
            included_loaded_internal: this.env.loadTemplate('included.twig')
        }
    }
}
