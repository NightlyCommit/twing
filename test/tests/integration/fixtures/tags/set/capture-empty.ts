import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"set" tag block empty capture';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo %}{% endset %}

{% if foo %}FAIL{% endif %}`
        };
    }

    getExpected() {
        return `
`;
    }

}
