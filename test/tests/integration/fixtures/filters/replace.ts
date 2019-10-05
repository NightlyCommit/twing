import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"replace" filter.';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "I liké %this% and %that%."|replace({'%this%': "foo", '%that%': "bar"}) }}
{{ 'I like single replace operation only %that%'|replace({'%that%' : '%that%1'}) }}
{{ 'I like %this% and %that%.'|replace(traversable) }}`
        };
    }

    getExpected() {
        return `
I liké foo and bar.
I like single replace operation only %that%1
I like foo and bar.
`;
    }

    getContext() {
        return {
            traversable: new Map([['%this%', 'foo'], ['%that%', 'bar']])
        }
    }
}
