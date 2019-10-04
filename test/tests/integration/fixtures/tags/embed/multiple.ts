import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"embed" tag';
    }

    getTemplates() {
        return {
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
FOO
{% embed "foo.twig" %}
    {% block c1 %}
        {{ parent() }}
        block1extended
    {% endblock %}
{% endembed %}

{% embed "foo.twig" %}
    {% block c1 %}
        {{ parent() }}
        block1extended
    {% endblock %}
{% endembed %}

BAR`
        };
    }

    getExpected() {
        return `
FOO

A
            block1

        block1extended
    B
    block2
C

A
            block1

        block1extended
    B
    block2
C
BAR
`;
    }


    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
