import TestBase from "../../TestBase";

/**
 * @see https://github.com/NightlyCommit/twing/issues/236
 */
export default class extends TestBase {
    getDescription() {
        return '"batch" filter on undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `{% for item in items|batch(3) %}
{% endfor %}
`
        };
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return `
`;
    }

    getContext() {
        return {};
    }
}
