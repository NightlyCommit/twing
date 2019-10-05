import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for an undefined parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends 'foo.html' %}

{% set foo = "foo" %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "foo.html" is not defined in "index.twig" at line 2.';
    }
}
