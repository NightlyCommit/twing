import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";
import Foo from "../../../../Foo";

export class Test extends TestBase {
    getDescription() {
        return '"defined" test';
    }

    getTemplates() {
        return {
            'index.twig': `{{ definedVar                     is     defined ? 'ok' : 'ko' }}
{{ definedVar                     is not defined ? 'ko' : 'ok' }}
{{ undefinedVar                   is     defined ? 'ko' : 'ok' }}
{{ undefinedVar                   is not defined ? 'ok' : 'ko' }}
{{ zeroVar                        is     defined ? 'ok' : 'ko' }}
{{ nullVar                        is     defined ? 'ok' : 'ko' }}
{{ nested.definedVar              is     defined ? 'ok' : 'ko' }}
{{ nested['definedVar']           is     defined ? 'ok' : 'ko' }}
{{ nested.definedVar              is not defined ? 'ko' : 'ok' }}
{{ nested.undefinedVar            is     defined ? 'ko' : 'ok' }}
{{ nested['undefinedVar']         is     defined ? 'ko' : 'ok' }}
{{ nested.undefinedVar            is not defined ? 'ok' : 'ko' }}
{{ nested.zeroVar                 is     defined ? 'ok' : 'ko' }}
{{ nested.nullVar                 is     defined ? 'ok' : 'ko' }}
{{ nested.definedArray.0          is     defined ? 'ok' : 'ko' }}
{{ nested['definedArray'][0]      is     defined ? 'ok' : 'ko' }}
{{ object.foo                     is     defined ? 'ok' : 'ko' }}
{{ object.undefinedMethod         is     defined ? 'ko' : 'ok' }}
{{ object.getFoo()                is     defined ? 'ok' : 'ko' }}
{{ object.getFoo('a')             is     defined ? 'ok' : 'ko' }}
{{ object.undefinedMethod()       is     defined ? 'ko' : 'ok' }}
{{ object.undefinedMethod('a')    is     defined ? 'ko' : 'ok' }}
{{ object.self.foo                is     defined ? 'ok' : 'ko' }}
{{ object.self.undefinedMethod    is     defined ? 'ko' : 'ok' }}
{{ object.undefinedMethod.self    is     defined ? 'ko' : 'ok' }}
{{ 0                              is     defined ? 'ok' : 'ko' }}
{{ "foo"                          is     defined ? 'ok' : 'ko' }}
{{ true                           is     defined ? 'ok' : 'ko' }}
{{ false                          is     defined ? 'ok' : 'ko' }}
{{ null                           is     defined ? 'ok' : 'ko' }}
{{ [1, 2]                         is     defined ? 'ok' : 'ko' }}
{{ { foo: "bar" }                 is     defined ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok`;
    }

    getContext() {
        return {
            definedVar: 'defined',
            zeroVar: 0,
            nullVar: null as any,
            nested: {
                definedVar: 'defined',
                zeroVar: 0,
                nullVar: null as any,
                definedArray: [0],
            },
            object: new Foo()
        };
    }
}

export class StrictVariablesSetToFalse extends Test {
    getDescription(): string {
        return super.getDescription() + ' (strict_variables set to false)';
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            strict_variables: false
        }
    }
}
