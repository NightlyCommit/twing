import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"map" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set offset = 3 %}

{% for k, v in [1, 2]|map((item) => item + 2 ) -%}
    {{ k }} = {{ v }}
{% endfor %}

{% for k, v in {a: 1, b: 2}|map((item) => item ~ "*" ) -%}
    {{ k }} = {{ v }}
{% endfor %}

{% for k, v in [1, 2]|map(item => item + 2 ) -%}
    {{ k }} = {{ v }}
{% endfor %}
`
        };
    }

    getExpected() {
        return `
0 = 3
1 = 4

a = 1*
b = 2*

0 = 3
1 = 4
`;
    }
}
