import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"range" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ range(0+1, 10+0, 2)|join(',') }}
{# named arguments #}
{{ range(low=0+1, high=10+0, step=2)|join(',') }}
{{ range(high=10+0, step=2, low=0+1)|join(',') }}
{{ range(0+1, step=2, high=10+0)|join(',') }}`
        };
    }

    getExpected() {
        return `
1,3,5,7,9
1,3,5,7,9
1,3,5,7,9
1,3,5,7,9
`;
    }
}
