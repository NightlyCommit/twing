import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"macro" function - aka a function needing the template';
    }

    getTemplates() {
        return {
            'index.twig': `
{% macro lorem(value) %}
    LOREM {{ value }}
{% endmacro %}
{% include "foo.twig" with {
    object: createObject({
        lorem: getMacro("lorem")
    })
} %}`,
            'foo.twig': `{{ object.lorem("FOO") }}`
        };
    }

    getExpected() {
        return `LOREM FOO`;
    }
}
