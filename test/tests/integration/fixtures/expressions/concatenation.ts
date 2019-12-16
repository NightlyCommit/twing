import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export class Test extends TestBase {
    getDescription() {
        return 'Concatenation';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "foo" ~ "bar" }}
{{ "foo" ~ 0 }}
{{ "foo" ~ 1 }}
{{ 0 ~ "foo" }}
{{ 1 ~ "foo" }}
{{ 0 ~ 1 }}
{{ 1 ~ 0 }}
{# properties #}
{{ "x" ~ content.defined }}
{{ "x" ~ content.undefined }}
{{ "x" ~ content.null }}
{{ content.defined ~ "x" }}
{{ content.undefined ~ "x" }}
{{ content.null ~ "x" }}
{# top-level variables #}
{{ "x" ~ defined }}
{{ "x" ~ undefined }}
{{ "x" ~ null }}
{{ defined ~ "x" }}
{{ undefined ~ "x" }}
{{ null ~ "x" }}`
        };
    }

    getExpected() {
        return `
foobar
foo0
foo1
0foo
1foo
01
10
xfoo
x
x
foox
x
x
xfoo
x
x
foox
x
x`;
    }

    getContext(): any {
        return {
            defined: 'foo',
            undefined: undefined,
            null: null,
            content: {
                defined: 'foo',
                undefined: undefined,
                null: null
            }
        };
    }
}
