import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"equal" operator';
    }

    getTemplates() {
        return {
            'index.twig': `false
{{ false == 0 ? 'ok' : 'ko' }}
{{ false == '' ? 'ok' : 'ko' }}
{{ false == '0' ? 'ok' : 'ko' }}
{{ false == nullVar ? 'ok' : 'ko' }}
{{ false == emptyArray ? 'ok' : 'ko' }}

1
{{ 1 == true ? 'ok' : 'ko' }}
{{ 1 == '1' ? 'ok' : 'ko' }}

0
{{ 0 == false ? 'ok' : 'ko' }}
{{ 0 == '0' ? 'ok' : 'ko' }}
{{ 0 == null ? 'ok' : 'ko' }}

-1
{{ -1 == true ? 'ok' : 'ko' }}
{{ -1 == '-1' ? 'ok' : 'ko' }}

"1"
{{ '1' == true ? 'ok' : 'ko' }}
{{ '1' == 1 ? 'ok' : 'ko' }}

"0"
{{ '0' == false ? 'ok' : 'ko' }}
{{ '0' == 0 ? 'ok' : 'ko' }}

"-1"
{{ '-1' == true ? 'ok' : 'ko' }}
{{ '-1' == -1 ? 'ok' : 'ko' }}

null
{{ nullVar == false ? 'ok' : 'ko' }}
{{ nullVar == 0 ? 'ok' : 'ko' }}
{{ nullVar == emptyArray ? 'ok' : 'ko' }}
{{ nullVar == '' ? 'ok' : 'ko' }}

[]
{{ emptyArray == false ? 'ok' : 'ko' }}
{{ emptyArray == nullVar ? 'ok' : 'ko' }}

"php"
{{ 'php' == true ? 'ok' : 'ko' }}
{{ 'php' == 0 ? 'ok' : 'ko' }}

""
{{ '' == false ? 'ok' : 'ko' }}
{{ '' == 0 ? 'ok' : 'ko' }}
{{ '' == nullVar ? 'ok' : 'ko' }}

{{ 1 == 2 ? 'ko' : 'ok' }}`
        };
    }

    getExpected() {
        return `false
ok
ok
ok
ok
ok

1
ok
ok

0
ok
ok
ok

-1
ok
ok

"1"
ok
ok

"0"
ok
ok

"-1"
ok
ok

null
ok
ok
ok
ok

[]
ok
ok

"php"
ok
ok

""
ok
ok
ok

ok`;
    }

    getContext() {
        return {
            nullVar: null as any,
            emptyArray: [] as any[]
        };
    }
}
