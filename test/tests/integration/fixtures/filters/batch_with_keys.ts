import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"batch" filter preserves array keys';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ {'foo': 'bar', 'key': 'value'}|batch(4)|first|keys|join(',') }}
{{ {'foo': 'bar', 'key': 'value'}|batch(4,'fill')|first|keys|join(',') }}
{{ {0: 'bar', 'key': 'value'}|batch(4,'fill')|first|keys|join(',') }}
{{ {0: 'bar', 'key': 'value'}|batch(4,'fill',false)|first|keys|join(',') }}`
        };
    }

    getExpected() {
        return `
foo,key
foo,key,0,1
0,key,1,2
0,1,2,3
`;
    }
}
