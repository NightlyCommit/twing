import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Functions as static method calls';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ static_call_string('foo') }}
{{ static_call_array('foo') }}`
        };
    }

    getExpected() {
        return `
*foo*
*foo*
`;
    }

    getContext() {
        return {
            foo: 'foo'
        }
    }
}
