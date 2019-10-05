import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the string operators as variable names in assignments';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for matches in [1, 2] %}
    {{- matches }}
{% endfor %}

{% set matches = [1, 2] %}

OK
`
        };
    }

    getExpected() {
        return `
1
2


OK`;
    }

    getContext() {
        return {}
    }
}
