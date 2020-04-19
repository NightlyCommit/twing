import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports string interpolation';
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            autoescape: false
        };
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "foo #{"foo #{bar} baz"} baz" }}
{{ "foo #{bar}#{bar} baz" }}
{% set var = 'value' %}
{{ "string \\"interpolation\\": '#{var}'" }}`
        };
    }

    getExpected() {
        return `
foo foo BAR baz baz
foo BARBAR baz
string "interpolation": 'value'
`;
    }

    getContext() {
        return {
            bar: 'BAR'
        }
    }
}
