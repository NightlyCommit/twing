import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"escape" filter does not escape with the html strategy when using the html_attr strategy';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ '<br />'|escape('html_attr') }}`
        };
    }

    getExpected() {
        return `
&lt;br&#x20;&#x2F;&gt;
`;
    }
}
