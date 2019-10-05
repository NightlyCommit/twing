import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"cycle" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for i in 0..6 %}
{{ cycle(array1, i) }}-{{ cycle(array2, i) }}
{% endfor %}
{# named arguments #}
{% for i in 0..6 %}
{{ cycle(values = array1, position = i) }}-{{ cycle(position = i, values = array2) }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
odd-apple
even-orange
odd-citrus
even-apple
odd-orange
even-citrus
odd-apple
odd-apple
even-orange
odd-citrus
even-apple
odd-orange
even-citrus
odd-apple`;
    }

    getContext() {
        return {
            array1: ['odd', 'even'],
            array2: ['apple', 'orange', 'citrus']
        }
    }
}
