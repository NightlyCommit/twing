import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"map" filter';
    }

    getContext(): any {
        return {
            peoples: [
                {
                    first_name: 'Bob'
                },
                {
                    first_name: 'Patrick'
                }
            ]
        };
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

{{ peoples|map(people => people.first_name)|join(', ') }}
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

Bob, Patrick
`;
    }
}
