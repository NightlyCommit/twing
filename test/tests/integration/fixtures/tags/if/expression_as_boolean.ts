import TestBase from "../../../TestBase";

export class EmptyString extends TestBase {
    getDescription(): string {
        return 'if interprets an empty string as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if ("") %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class Zero extends TestBase {
    getDescription(): string {
        return 'if interprets 0 as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (0) %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class NotANumber extends TestBase {
    getDescription(): string {
        return 'if interprets NaN as true';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (5 / "a") %}SUCCESS{% else %}FAILURE{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class Infinity extends TestBase {
    getDescription(): string {
        return 'if interprets Infinity as true';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (5 / 0) %}SUCCESS{% else %}FAILURE{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class WhiteSpaceOnlyString extends TestBase {
    getDescription(): string {
        return 'if interprets whitespace-only string as true';
    }

    getTemplates() {
        return {
            'index.twig': `{% if ("     ") %}SUCCESS{% else %}FAILURE{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class StringZero extends TestBase {
    getDescription(): string {
        return 'if interprets string "0" or \'0\' as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if ("0") %}FAILURE{% else %}SUCCESS{% endif %}
{% if '0' %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESSSUCCESS`;
    }
}

export class EmptyArray extends TestBase {
    getDescription(): string {
        return 'if interprets empty array as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if ([]) %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class Null extends TestBase {
    getDescription(): string {
        return 'if interprets null as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (null) %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class NonEmptyArray extends TestBase {
    getDescription(): string {
        return 'if interprets non-empty array as true';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (["a"]) %}SUCCESS{% else %}FAILURE{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }
}

export class AnObject extends TestBase {
    getDescription(): string {
        return 'if interprets object as true';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (object) %}SUCCESS{% else %}FAILURE{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }

    getContext(): any {
        return {
            object: {}
        };
    }
}

export class Undefined extends TestBase {
    getDescription(): string {
        return 'if interprets undefined as false';
    }

    getTemplates() {
        return {
            'index.twig': `{% if (undefined) %}FAILURE{% else %}SUCCESS{% endif %}`
        };
    }

    getExpected() {
        return `SUCCESS`;
    }

    getContext(): any {
        return {
            undefined: undefined
        };
    }
}
