import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"apply" tags accept multiple chained filters';
    }

    getTemplates() {
        return {
            'index.twig': `
{% apply lower|title %}
  {{ var }}
{% endapply %}`
        };
    }

    getExpected() {
        return `
    Var
`;
    }

    getContext() {
        return {
            var: 'VAR'
        }
    }
}
