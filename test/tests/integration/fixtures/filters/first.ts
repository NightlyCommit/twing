import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"first" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ [1, 2, 3, 4]|first }}
{{ {a: 1, b: 2, c: 3, d: 4}|first }}
{{ '1234'|first }}
{{ arr|first }}
{{ 'Ä€é'|first }}
{{ ''|first }}`
        };
    }

    getExpected() {
        return `
1
1
1
1
Ä
`;
    }

    getContext() {
        return {
            arr: [1, 2, 3, 4]
        }
    }
}
