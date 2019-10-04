import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"§" custom tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% § %}`
        };
    }

    getExpected() {
        return `
§
`;
    }

}
