import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Nested "embed" tags';
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
{% embed "foo.twig" %}
    {% block c1 %}
        {{ parent() }}
        {% embed "foo.twig" %}
            {% block c1 %}
                {{ parent() }}
                block1extended
            {% endblock %}
        {% endembed %}

    {% endblock %}
{% endembed %}`
        };
    }

    getExpected() {
        return `
A
            block1

        
A
                    block1

                block1extended
            B
    block2
C
    B
    block2
C
`;
    }

    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
