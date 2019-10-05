import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"merge" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ items|merge({'bar': 'foo'})|join }}
{{ items|merge({'bar': 'foo'})|keys|join }}
{{ {'bar': 'foo'}|merge(items)|join }}
{{ {'bar': 'foo'}|merge(items)|keys|join }}
{{ numerics|merge([4, 5, 6])|join }}
{{ traversable.a|merge(traversable.b)|join }}`
        };
    }

    getExpected() {
        return `
barfoo
foobar
foobar
barfoo
123456
123b
`;
    }

    getContext() {
        let traversable = new Map();

        traversable.set('a', [1, 2, 3]);
        traversable.set('b', new Map([
            ['a', 'b']
        ]));

        return {
            items: new Map([
                ['foo', 'bar']
            ]),
            numerics: [1, 2, 3],
            traversable: traversable
        }
    }
}
