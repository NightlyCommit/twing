import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'array index test';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for key, value in days %}
{{ key }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
1
2
3
4
18
19
31
`;
    }

    getContext() {
        return {
            days: new Map([
                [1, {money: 9}],
                [2, {money: 21}],
                [3, {money: 38}],
                [4, {money: 6}],
                [18, {money: 96}],
                [19, {money: 3}],
                [31, {money: 11}],
            ])
        }
    }
}
