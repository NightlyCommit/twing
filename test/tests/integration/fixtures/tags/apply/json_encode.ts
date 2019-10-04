import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"apply" tag applies json_encode on its children';
    }

    getTemplates() {
        return {
            'index.twig': `
{% apply json_encode|raw %}test{% endapply %}`
        };
    }

    getExpected() {
        return `
"test"
`;
    }
}
