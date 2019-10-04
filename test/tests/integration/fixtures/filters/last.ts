import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"last" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ [1, 2, 3, 4]|last }}
{{ {a: 1, b: 2, c: 3, d: 4}|last }}
{{ '1234'|last }}
{{ arr|last }}
{{ 'Ä€é'|last }}
{{ ''|last }}`
        };
    }

    getExpected() {
        return `
4
4
4
4
é
`;
    }

    getContext() {
        return {
            arr: [1, 2, 3, 4]
        }
    }
}
