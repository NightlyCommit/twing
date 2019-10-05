import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set offset = 3 %}

{% for k, v in [1, 5, 3, 4, 5]|filter((v) => v > offset) -%}
    {{ k }} = {{ v }}
{% endfor %}

{% for k, v in {a: 1, b: 2, c: 5, d: 2}|filter((v) => v > offset) -%}
    {{ k }} = {{ v }}
{% endfor %}

{% for k, v in [1, 5, 3, 4, 5]|filter(v => v > offset) -%}
    {{ k }} = {{ v }}
{% endfor %}
`
        };
    }

    getExpected() {
        return `
1 = 5
3 = 4
4 = 5

c = 5

1 = 5
3 = 4
4 = 5
`;
    }
}
