import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"escape" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "foo <br />"|e }}`
        };
    }

    getExpected() {
        return `
foo &lt;br /&gt;
`;
    }
}
