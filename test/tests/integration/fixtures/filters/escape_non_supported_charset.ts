import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"escape" filter with non-supported charset';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "愛していますか？ <br />"|e }}`
        };
    }

    getExpected() {
        return `
愛していますか？ &lt;br /&gt;
`;
    }
}
