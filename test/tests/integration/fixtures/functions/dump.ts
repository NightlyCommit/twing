import TestBase from "../../TestBase";

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

    getEnvironmentOptions() {
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
