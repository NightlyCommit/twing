import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing allows to use named operators as variable names';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for match in matches %}
    {{- match }}
{% endfor %}
{{ in }}
{{ is }}`
        };
    }

    getExpected() {
        return `
1
2
3
in
is
`;
    }

    getContext() {
        return {
            matches: [1, 2, 3],
            in: 'in',
            is: 'is'
        }
    }
}
