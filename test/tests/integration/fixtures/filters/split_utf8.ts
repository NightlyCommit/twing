import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"split" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "é"|split('', 10)|join('-') }}
{{ foo|split(',')|join('-') }}
{{ foo|split(',', 1)|join('-') }}
{{ foo|split(',', 2)|join('-') }}
{{ foo|split(',', 3)|join('-') }}
{{ baz|split('')|join('-') }}
{{ baz|split('', 1)|join('-') }}
{{ baz|split('', 2)|join('-') }}`
        };
    }

    getExpected() {
        return `
é
Ä-é-Äほ
Ä,é,Äほ
Ä-é,Äほ
Ä-é-Äほ
é-Ä-ß-ご-a
é-Ä-ß-ご-a
éÄ-ßご-a`;
    }

    getContext() {
        return {
            foo: 'Ä,é,Äほ',
            baz: 'éÄßごa'
        }
    }
}
