import TestBase from "../../TestBase";
import {TwingMarkup} from "../../../../../src/lib/markup";

export default class extends TestBase {
    getDescription() {
        return '"json_encode" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "foo"|json_encode|raw }}
{{ foo|json_encode|raw }}
{{ [foo, "foo"]|json_encode|raw }}
{{ map|json_encode|raw }}

{{ {0: "apple", "1": "banana", 2: "peach", 3: "plum"}|json_encode|raw }}
{{ {1: "apple", "2": "banana", 3: "peach", 4: "plum"}|json_encode|raw }}
`
        };
    }

    getExpected() {
        return `
"foo"
"foo"
["foo","foo"]
{"message":"Hello, world!"}

["apple","banana","peach","plum"]
{"1":"apple","2":"banana","3":"peach","4":"plum"}
`;
    }

    getContext() {
        return {
            foo: new TwingMarkup('foo', 'UTF-8'),
            map: new Map([['message', 'Hello, world!']])
        };
    }
}
