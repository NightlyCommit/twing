import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function is safe for auto-escaping';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("foo.twig") }}`,
            'foo.twig': `
<p>Test</p>`
        };
    }

    getExpected() {
        return `
<p>Test</p>
`;
    }
}
