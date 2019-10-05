import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"join" filter on undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ foo|join(', ') }}
`
        };
    }

    getExpected() {
        return `
`;
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            strict_variables: false
        };
    }
}
