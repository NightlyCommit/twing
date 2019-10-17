import TestBase from "../../../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../../../src/lib/environment-options";

export class Basic extends TestBase {
    getDescription() {
        return '"sandbox" tag checks implicit toString calls when using concatenation';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ article ~ article }}
`,
            'index.twig': `{% sandbox %}
    {% include 'foo.twig' %}
{% endsandbox %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedMethodError: Calling "toString" method on a "Object" is not allowed in "foo.twig" at line 2.';
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            autoescape: false
        };
    }

    getContext() {
        return {
            article: {
                toString: () => {
                    return 'Article';
                }
            }
        }
    }
}

export class Set extends Basic {
    getDescription() {
        return '"sandbox" tag checks implicit toString calls when using concatenation with the "set" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% sandbox %}
    {% include "foo.twig" %}
{% endsandbox %}
`,
            'foo.twig': `
{% set a = article ~ article %}
`
        };
    }

    getExpectedErrorMessage(): string {
        return 'TwingSandboxSecurityNotAllowedMethodError: Calling "toString" method on a "Object" is not allowed in "foo.twig" at line 3.';
    }

    getSandboxSecurityPolicyTags(): string[] {
        return [
            'set'
        ];
    }
}
