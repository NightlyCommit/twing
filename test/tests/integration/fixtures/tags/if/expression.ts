import TestBase from "../../../TestBase";

export class If extends TestBase {
    getDescription(): string {
        return '"if" takes an expression as a test';
    }

    getTemplates() {
        return {
            'index.twig': `{% if a < 2 %}
    A1
{% elseif a > 10 %}
    A2
{% else %}
    A3
{% endif %}`
        };
    }

    getExpected() {
        return `
    A1
`;
    }


    getContext() {
        return {
            a: 1
        };
    }
}

export class ElseIf extends If {
    getExpected() {
        return `
    A2`;
    }

    getContext(): any {
        return {
            a: 12
        }
    }
}

export class Else extends If {
    getExpected() {
        return `
    A3`;
    }

    getContext(): any {
        return {
            a: 7
        }
    }
}
