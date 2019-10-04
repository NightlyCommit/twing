import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"set" tag block capture';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo %}f<br />o<br />o{% endset %}

{{ foo }}`
        };
    }

    getExpected() {
        return `
f<br />o<br />o
`;
    }

}
