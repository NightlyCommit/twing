import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

class Test extends TestBase {
    getDescription() {
        return '"raw" filter on undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ foo|raw }}
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

export default Test;
