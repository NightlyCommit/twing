import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'issue #360';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set aaa = ["apple", "banana", "peach", "plum"] %}
{{ aaa|slice(1, 2)|json_encode|raw }}`
        };
    }

    getExpected() {
        return `
["banana","peach"]`;
    }
}
