import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"number_format" filter with defaults.';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 20|number_format }}
{{ 20.25|number_format }}
{{ 20.25|number_format(1) }}
{{ 20.25|number_format(2, ',') }}
{{ 1020.25|number_format }}
{{ 1020.25|number_format(2, ',') }}
{{ 1020.25|number_format(2, ',', '.') }}`
        };
    }

    getExpected() {
        return `
20!00
20!25
20!3
20,25
1=020!25
1=020,25
1.020,25
`;
    }

    getContext() {
        this.env.getCoreExtension().setNumberFormat(2, '!', '=');

        return {};
    }
}
