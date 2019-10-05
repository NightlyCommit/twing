import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '_self returns the template name';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ _self }}`
        };
    }

    getExpected() {
        return `
index.twig
`;
    }
}
