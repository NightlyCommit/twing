import TestBase from "../../../TestBase";

export class If extends TestBase {
    getDescription(): string {
        return '"if" creates a condition';
    }

    getTemplates() {
        return {
            'index.twig': `{% if a is defined %}
    {{ a }}
{% elseif b is defined %}
    {{ b }}
{% else %}
    NOTHING
{% endif %}`
        };
    }

    getExpected() {
        return `
    a`;
    }

    getContext(): any {
        return {
            a: 'a'
        }
    }
}

export class ElseIf extends If {
    getExpected() {
        return `
    b`;
    }

    getContext(): any {
        return {
            b: 'b'
        }
    }
}

export class Else extends If {
    getExpected() {
        return `
    NOTHING`;
    }

    getContext(): any {
        return {}
    }
}
