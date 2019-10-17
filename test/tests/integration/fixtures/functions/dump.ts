import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"dump" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ dump('foo') }}
{{ dump(foo, bar) }}`
        };
    }

    getExpected() {
        return `
string(3) "foo"

string(3) "foo"
string(3) "bar"
`;
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            debug: true,
            autoescape: false
        }
    }

    getContext() {
        return {
            foo: 'foo',
            bar: 'bar'
        }
    }
}
