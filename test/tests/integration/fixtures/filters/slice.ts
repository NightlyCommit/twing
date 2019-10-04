import TestBase from "../../TestBase";

// fake XML class to ensure that any iterator is supported
class SimpleXMLElement {
    xml: string;

    constructor(xml: string) {
        this.xml = xml;
    }

    *[Symbol.iterator]() {
        yield 1;
        yield 2;
    }
}

export default class extends TestBase {
    getDescription() {
        return '"slice" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ [1, 2, 3, 4][1:2]|join('') }}
{{ {a: 1, b: 2, c: 3, d: 4}[1:2]|join('') }}
{{ [1, 2, 3, 4][start:length]|join('') }}
{{ [1, 2, 3, 4]|slice(1, 2)|join('') }}
{{ [1, 2, 3, 4]|slice(1, 2)|keys|join('') }}
{{ [1, 2, 3, 4]|slice(1, 2, true)|keys|join('') }}
{{ {a: 1, b: 2, c: 3, d: 4}|slice(1, 2)|join('') }}
{{ {a: 1, b: 2, c: 3, d: 4}|slice(1, 2)|keys|join('') }}
{{ '1234'|slice(1, 2) }}
{{ '1234'[1:2] }}
{{ arr|slice(1, 2)|join('') }}
{{ arr[1:2]|join('') }}
{{ arr[4:1]|join('') }}
{{ arr[3:2]|join('') }}

{{ [1, 2, 3, 4]|slice(1)|join('') }}
{{ [1, 2, 3, 4][1:]|join('') }}
{{ '1234'|slice(1) }}
{{ '1234'[1:] }}
{{ '1234'[:1] }}

{{ arr|slice(3)|join('') }}
{{ arr[2:]|join('') }}
{{ xml|slice(1)|join('')}}`
        };
    }

    getExpected() {
        return `
23
23
23
23
01
12
23
bc
23
23
23
23

4

234
234
234
234
1

4
34
2
`;
    }

    getContext() {
        return {
            start: 1,
            length: 2,
            arr: [1, 2, 3, 4],
            xml: new SimpleXMLElement('<items><item>1</item><item>2</item></items>'),
        }
    }
}
