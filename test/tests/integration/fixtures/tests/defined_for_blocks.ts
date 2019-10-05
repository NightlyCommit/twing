import TestBase from "../../TestBase";

/**
 * Note that the expected result from the original TwigPHP test is incorrect - but for some reason, the test passes successfully on TwigPHP.
 * @see * https://twigfiddle.com/22p2t1
 */
export default class extends TestBase {
    getName() {
        return 'tests/defined_for_blocks';
    }

    getDescription() {
        return '"defined" support for blocks';
    }

    getTemplates() {
        return {
            'index.twig': `{% extends 'parent' %}
{% block icon %}icon{% endblock %}
{% block body %}
    {{ parent() }}
    {{ block('foo') is defined ? 'ok' : 'ko' }}
    {{ block('footer') is defined ? 'ok' : 'ko' }}
    {{ block('icon') is defined ? 'ok' : 'ko' }}
    {{ block('block1') is defined ? 'ok' : 'ko' }}
    {%- embed 'embed' %}
        {% block content %}content{% endblock %}
    {% endembed %}
{% endblock %}
{% use 'blocks' %}`,
            'blocks': `{% block block1 %}{%endblock %}
`,
            'embed': `{{ block('icon') is defined ? 'ok' : 'ko' }}
{{ block('content') is defined ? 'ok' : 'ko' }}
{{ block('block1') is defined ? 'ok' : 'ko' }}`,
            'parent': `{% block body %}
    {{ block('icon') is defined ? 'ok' : 'ko' -}}
{% endblock %}
{% block footer %}{% endblock %}`
        };
    }

    getExpected() {
        return `
ok
    ko
    ok
    ok
    okko
ok
ko
`;
    }
}
