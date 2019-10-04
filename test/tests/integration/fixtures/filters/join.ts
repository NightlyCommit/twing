import TestBase from "../../TestBase";
import Foo from "../../../../Foo";

export default class extends TestBase {
    getDescription() {
        return '"join" filter';
    }

    getTemplates() {
        return {
            'index.twig': `{{ ["foo", "bar"]|join(', ') }}
{{ foo|join(', ') }}
{{ bar|join(', ') }}

{{ ["foo", "bar"]|join(', ', ' and ') }}
{{ foo|join(', ', ' and ') }}
{{ bar|join(', ', ' and ') }}
{{ ["one", "two", "three"]|join(', ', ' and ') }}
{{ ["a", "b", "c"]|join('','-') }}
{{ ["a", "b", "c"]|join('-','-') }}
{{ ["a", "b", "c"]|join('-','') }}
{{ ["hello"]|join('|','-') }}

{{ {"a": "w", "b": "x", "c": "y", "d": "z"}|join }}
{{ {"a": "w", "b": "x", "c": "y", "d": "z"}|join(',') }}
{{ {"a": "w", "b": "x", "c": "y", "d": "z"}|join(',','-') }}
`
        };
    }

    getExpected() {
        return `foo, bar
1, 2
3, 4

foo and bar
1 and 2
3 and 4
one, two and three
ab-c
a-b-c
a-bc
hello

wxyz
w,x,y,z
w,x,y-z
`;
    }

    getContext() {
        return {
            foo: new Foo(),
            bar: [3, 4]
        }
    }
}
