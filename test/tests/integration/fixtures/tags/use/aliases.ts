import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'blocks.twig': `
{% block content 'foo' %}`,
            'index.twig': `
{% use "blocks.twig" with content as foo %}

{{ block('foo') }}`
        };
    }

    getExpected() {
        return `
foo
`;
    }

}
