import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getName() {
        return 'backtick support';
    }

    getDescription() {
        return 'backticks';
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            debug: true
        };
    }

    getTemplates() {
        return {
            'index.twig': `{# Foo \`bar\` #}
Foo \`bar\`
`
        };
    }

    getExpected() {
        return `Foo \`bar\``;
    }
}
