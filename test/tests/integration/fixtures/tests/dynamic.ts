import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'dynamic test';
    }

    getTemplates() {
        return {
            'index.twig': `{{ 'bar' is test_bar ? '1' :'0' }}
{{ 'foo' is test_foo ? '1' :'0' }}
{{ 'bar' is test_foo ? '1' :'0' }}
{{ 'foo' is test_bar ? '1' :'0' }}
`
        };
    }

    getExpected() {
        return `1
1
0
0
`;
    }
}
