import TestBase from "../../../TestBase";

abstract class Test extends TestBase {
    getDescription(): string {
        return '"extends" tag';
    }

    getTemplates() {
        return {
            'index.twig': `{% extends foo ? 'foo.twig' : 'bar.twig' %}`,
            'bar.twig': `BAR`,
            'foo.twig': `FOO`
        }
    }
}

export class True extends Test {
    getExpected() {
        return `
FOO`;
    }


    getContext() {
        return {
            foo: true
        }
    }
}

export class False extends Test {
    getExpected() {
        return `
BAR`;
    }


    getContext() {
        return {
            foo: false
        }
    }
}
