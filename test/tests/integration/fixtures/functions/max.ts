import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"max" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ max([2, 1, 3, 5, 4]) }}
{{ max(2, 1, 3, 5, 4) }}
{{ max({2:"two", 1:"one", 3:"three", 5:"five", 4:"for"}) }}`
        };
    }

    getExpected() {
        return `
5
5
two
`;
    }
}
