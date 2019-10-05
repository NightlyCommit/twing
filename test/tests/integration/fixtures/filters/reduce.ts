import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"reduce" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set offset = 3 %}

{{ [1, -1, 4]|reduce((carry, item) => carry + item + offset) }}
{{ [1, -1, 4]|reduce((carry, item) => carry + item + offset, 10) }}
`
        };
    }

    getExpected() {
        return `
13
23
`;
    }
}
