import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'bar.twig': `
{% block content 'bar' %}
{% block bar 'bar' %}`,
            'foo.twig': `
{% block content 'foo' %}
{% block foo 'foo' %}`,
            'index.twig': `
{% use "foo.twig" with content as foo_content %}
{% use "bar.twig" %}

{{ block('content') }}
{{ block('foo') }}
{{ block('bar') }}
{{ block('foo_content') }}`
        };
    }

    getExpected() {
        return `
bar
foo
bar
foo
`;
    }

}
