import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" tags can be nested at will';
    }

    getTemplates() {
        return {
            'index.twig': `
{% filter lower|title %}
  {{ var }}
  {% filter upper %}
    {{ var }}
  {% endfilter %}
  {{ var }}
{% endfilter %}`
        };
    }

    getExpected() {
        return `
  Var
      Var
    Var
`;
    }


    getExpectedDeprecationMessages() {
        return [
            'The "filter" tag in "index.twig" at line 2 is deprecated since Twig 2.9, use the "apply" tag instead.',
            'The "filter" tag in "index.twig" at line 4 is deprecated since Twig 2.9, use the "apply" tag instead.'
        ];
    }

    getContext() {
        return {
            var: 'VAR'
        }
    }
}
