import TestBase from "../../TestBase";
import {TwingEnvironment} from "../../../../../src/lib/environment";

export default class extends TestBase {
    setEnvironment(env: TwingEnvironment) {
        Reflect.set(env.constructor, 'E_NOTICE', 8);
        Reflect.set(env.constructor, 'TwigTestFoo::BAR_NAME', 'bar');

        super.setEnvironment(env);
    }

    getDescription() {
        return '"constant" test';
    }

    getTemplates() {
        return {
            'index.twig': `{{ 8 is constant('E_NOTICE') ? 'ok' : 'no' }}
{{ 'bar' is constant('TwigTestFoo::BAR_NAME') ? 'ok' : 'no' }}
{{ value is constant('TwigTestFoo::BAR_NAME') ? 'ok' : 'no' }}
{{ 2 is constant('ARRAY_AS_PROPS', object) ? 'ok' : 'no' }}`
        };
    }

    getExpected() {
        return `ok
ok
ok
ok`;
    }

    getContext() {
        const Obj = class {
            static ARRAY_AS_PROPS = 2;
        };

        return {
            value: 'bar',
            object: new Obj()
        };
    }
}
