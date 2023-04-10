import TestBase from "../../TestBase";

export class BaseIterableTest extends TestBase {
    getDescription() {
        return 'base "iterable" test';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ foo is iterable ? 'ok' : 'ko' }}
{{ traversable is iterable ? 'ok' : 'ko' }}
{{ obj is iterable ? 'ok' : 'ko' }}
{{ val is iterable ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `
ok
ok
ko
ko`;
    }

    getContext() {
        let foo: any[] = [];
        let traversable = new Map([[0, []]]);

        return {
            foo: foo,
            traversable: traversable,
            obj: new Object(),
            val: 'test'
        }
    }
}

export class NullIterableTest extends TestBase {
    getDescription() {
        return '`null` values are not iterable';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ nullValuePassedIn is iterable ? 'ok' : 'ko' }}
{% if nullValuePassedIn is iterable %}ok{% else %}ko{% endif %}

{% set nullValueFromSetOneLiner = null %}
{{ nullValueFromSetOneLiner is iterable ? 'ok' : 'ko' }}
{% if nullValueFromSetOneLiner is iterable %}ok{% else %}ko{% endif %}

{% set nullValueFromSetBlock %}{{ null }}{% endset %}
{{ nullValueFromSetBlock is iterable ? 'ok' : 'ko' }}
{% if nullValueFromSetBlock is iterable %}ok{% else %}ko{% endif %}`
        };
    }

    getExpected() {
        return `
ko
ko
ko
ko
ko
ko`;
    }

    getContext() {
        return {
            nullValuePassedIn: null as any
        }
    }
}

export class NotDefinedTernaryIterableTest extends TestBase {
    getDescription() {
        return 'checking if a not-defined variable is iterable via ternary throws a "does not exist" runtime error if `strict_variables` is enabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{{ notDefinedVar is iterable ? 'ok' : 'ko' }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `notDefinedVar` does not exist in "index.twig" at line 1.';
    }
}

export class NotDefinedIfIterableTest extends TestBase {
    getDescription() {
        return 'checking if a not-defined variable is iterable via `if` throws a "does not exist" runtime error if `strict_variables` is enabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{% if notDefinedVar is iterable %}ok{% else %}ko{% endif %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `notDefinedVar` does not exist in "index.twig" at line 1.';
    }
}

export class UndefinedTernaryIterableTest extends TestBase {
    getDescription() {
        return 'checking if an `undefined` variable is iterable via ternary evaluates to `false` if `strict_variables` is enabled (though ideally would throw a "does not exist" runtime error instead).';
    }

    getTemplates() {
        return {
            'index.twig': `{{ undefinedVar is iterable ? 'ok' : 'ko' }}`
        };
    }

    getContext() {
        return {
            undefinedVar: undefined as any
        }
    }

    getExpected() {
        return `ko`;
    }
}

export class UndefinedIfIterableTest extends TestBase {
    getDescription() {
        return 'checking if an `undefined` variable is iterable via `if` evaluates to `false` if `strict_variables` is enabled (though ideally would throw a "does not exist" runtime error instead).';
    }

    getTemplates() {
        return {
            'index.twig': `{% if undefinedVar is iterable %}ok{% else %}ko{% endif %}`
        };
    }

    getContext() {
        return {
            undefinedVar: undefined as any
        }
    }

    getExpected() {
        return `ko`;
    }
}

export class NotDefinedTernaryNotStrictIterableTest extends TestBase {
    getDescription() {
        return 'checking if a not-defined variable is iterable via ternary evaluates to `false` if `strict_variables` is disabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{{ notDefinedVar is iterable ? 'ok' : 'ko' }}`
        };
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return `ko`;
    }
}

export class NotDefinedIfNotStrictIterableTest extends TestBase {
    getDescription() {
        return 'checking if a not-defined variable is iterable via `if` evaluates to `false` if `strict_variables` is disabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{% if notDefinedVar is iterable %}ok{% else %}ko{% endif %}`
        };
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return `ko`;
    }
}

export class UndefinedTernaryNotStrictIterableTest extends TestBase {
    getDescription() {
        return 'checking if an `undefined` variable is iterable via ternary evaluates to `false` if `strict_variables` is disabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{{ undefinedVar is iterable ? 'ok' : 'ko' }}`
        };
    }

    getContext() {
        return {
            undefinedVar: undefined as any
        }
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return `ko`;
    }
}

export class UndefinedIfNotStrictIterableTest extends TestBase {
    getDescription() {
        return 'checking if an `undefined` variable is iterable via `if` evaluates to `false` if `strict_variables` is disabled.';
    }

    getTemplates() {
        return {
            'index.twig': `{% if undefinedVar is iterable %}ok{% else %}ko{% endif %}`
        };
    }

    getContext() {
        return {
            undefinedVar: undefined as any
        }
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return `ko`;
    }
}
