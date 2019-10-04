import TestBase from "../../../TestBase";
import {TwingMarkup} from "../../../../../../src/lib/markup";

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


    getEnvironmentOptions() {
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
