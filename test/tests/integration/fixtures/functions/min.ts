import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"min" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ min(2, 1, 3, 5, 4) }}
{{ min([2, 1, 3, 5, 4]) }}
{{ min({2:"two", 1:"one", 3:"three", 5:"five", 4:"for"}) }}`
        };
    }

    getExpected() {
        return `
1
1
five
`;
    }
}
