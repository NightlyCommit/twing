import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"reverse" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ [1, 2, 3, 4]|reverse|join('') }}
{{ '1234évènement'|reverse }}
{{ arr|reverse|join('') }}
{{ {'a': 'c', 'b': 'a'}|reverse()|join(',') }}
{{ {'a': 'c', 'b': 'a'}|reverse(preserveKeys=true)|join(glue=',') }}
{{ {'a': 'c', 'b': 'a'}|reverse(preserve_keys=true)|join(glue=',') }}`
        };
    }

    getExpected() {
        return `
4321
tnemenèvé4321
4321
a,c
a,c
a,c
`;
    }

    getContext() {
        return {
            arr: [1, 2, 3, 4]
        }
    }
}
