import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"embed" tag';
    }

    getTemplates() {
        return {
            'base.twig': `
A
{% block c1 %}
    blockc1base
{% endblock %}
{% block c2 %}
    blockc2base
{% endblock %}
B`,
            'foo.twig': `
A
{% block c1 %}
    block1
{% endblock %}
B
{% block c2 %}
    block2
{% endblock %}
C`,
            'index.twig': `
{% extends "base.twig" %}

{% block c1 %}
    {{ parent() }}
    blockc1baseextended
{% endblock %}

{% block c2 %}
    {{ parent() }}

    {% embed "foo.twig" %}
        {% block c1 %}
            {{ parent() }}
            block1extended
        {% endblock %}
    {% endembed %}
    {{ parent() }}
{% endblock %}`
        };
    }

    getExpected() {
        return `
A
        blockc1base

    blockc1baseextended
        blockc2base


    
A
                block1

            block1extended
        B
    block2
C        blockc2base

B`;
    }

    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
