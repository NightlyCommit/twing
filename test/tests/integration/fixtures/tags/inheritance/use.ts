import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'index.twig': `
{% extends "parent.twig" %}

{% use "use1.twig" %}
{% use "use2.twig" %}

{% block content_parent %}
    {{ parent() }}
{% endblock %}

{% block content_use1 %}
    {{ parent() }}
{% endblock %}

{% block content_use2 %}
    {{ parent() }}
{% endblock %}

{% block content %}
    {{ block('content_use1_only') }}
    {{ block('content_use2_only') }}
{% endblock %}`,
            'parent.twig': `
{% block content_parent 'content_parent' %}
{% block content_use1 'content_parent' %}
{% block content_use2 'content_parent' %}
{% block content '' %}`,
            'use1.twig': `
{% block content_use1 'content_use1' %}
{% block content_use2 'content_use1' %}
{% block content_use1_only 'content_use1_only' %}`,
            'use2.twig': `
{% block content_use2 'content_use2' %}
{% block content_use2_only 'content_use2_only' %}`
        };
    }

    getExpected() {
        return `
    content_parent
    content_use1
    content_use2
    content_use1_only
    content_use2_only`;
    }

}
