import TestBase from "../../TestBase";
import {TwingEnvironment} from "../../../../../src/lib/environment";

const DATE_W3C = 'DATE_W3C';

const Obj = class {
    static ARRAY_AS_PROPS: number = 2;
};

const object = new Obj();

export default class extends TestBase {
    setEnvironment(env: TwingEnvironment) {
        Reflect.set(env.constructor, 'DATE_W3C', 'DATE_W3C');
        Reflect.set(env.constructor, 'ARRAY_AS_PROPS', object);

        super.setEnvironment(env);
    }

    getDescription() {
        return '"constant" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ constant('DATE_W3C') == expect ? 'true' : 'false' }}
{{ constant('ARRAY_AS_PROPS', object) }}
{# named arguments #}
{{ constant(name = 'DATE_W3C') == expect ? 'true' : 'false' }}
{{ constant(object = object, name = 'ARRAY_AS_PROPS') }}`
        };
    }

    getExpected() {
        return `
true
2
true
2`;
    }

    getContext() {
        return {
            expect: DATE_W3C,
            object: object
        }
    }
}
