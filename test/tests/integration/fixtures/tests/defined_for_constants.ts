import TestBase from "../../TestBase";
import {TwingEnvironment} from "../../../../../src/lib/environment";

const DATE_W3C = 'DATE_W3C';

export default class extends TestBase {
    setEnvironment(env: TwingEnvironment) {
        Reflect.set(env.constructor, 'DATE_W3C', DATE_W3C);

        super.setEnvironment(env);
    }

    getDescription() {
        return '"defined" support for constants';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ constant('DATE_W3C') is defined ? 'ok' : 'ko' }}
{{ constant('ARRAY_AS_PROPS', object) is defined ? 'ok' : 'ko' }}
{{ constant('FOOBAR') is not defined ? 'ok' : 'ko' }}
{{ constant('FOOBAR', object) is not defined ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `
ok
ok
ok
ok
`;
    }

    getContext() {
        const Obj = class {
            static ARRAY_AS_PROPS = 2;
        };

        return {
            expect: DATE_W3C,
            object: new Obj()
        }
    }
}
