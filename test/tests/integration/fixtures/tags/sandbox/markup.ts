import TestBase from "../../../TestBase";
import {TwingMarkup} from "../../../../../../src/lib/markup";
import {TwingEnvironmentOptions} from "../../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag ignore TwingMarkup';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ markup }}
`,
            'index.twig': `{% sandbox %}
    {% include 'foo.twig' %}
{% endsandbox %}`
        };
    }

    getExpected() {
        return `Foo
`;
    }


    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            autoescape: false
        };
    }

    getContext() {
        return {
            markup: new TwingMarkup('Foo', 'utf-8')
        }
    }
}
