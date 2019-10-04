import TestBase from "../../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag checks implicit toString calls when filtered';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ article }}
`,
            'index.twig': `{% sandbox %}
    {% include 'foo.twig' %}
{% endsandbox %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedMethodError: Calling "toString" method on a "Object" is not allowed in "foo.twig" at line 2.';
    }

    getSandboxSecurityPolicyFilters() {
        return ['upper'];
    }

    getEnvironmentOptions() {
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
