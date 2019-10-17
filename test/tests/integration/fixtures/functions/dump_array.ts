import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"dump" function, xdebug is not loaded or xdebug <2.2-dev is loaded';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ dump() }}
`
        };
    }

    getExpected() {
        return `
array(3) {
    [foo] =>
    string(3) "foo"
    [bar] =>
    string(3) "bar"
    [global] =>
    string(6) "global"
}
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
