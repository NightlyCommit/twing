import * as tape from 'tape';
import {TwingExtensionCore} from "../../../../../../src/lib/extension/core";
import {TwingLoaderNull} from "../../../../../../src/lib/loader/null";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingFunction} from "../../../../../../src/lib/function";
import {TwingCallableArgument} from "../../../../../../src/lib/callable-wrapper";
import {TwingFilter} from "../../../../../../src/lib/filter";

export class CoreTestIterator {
    map: Map<any, any>;
    mapKeys: string[];
    position: number;
    allowValueAccess: boolean;
    maxPosition: number;

    constructor(values: Map<any, any>, keys: any[], allowValueAccess: boolean = false, maxPosition: number | boolean = false) {
        this.map = values;
        this.mapKeys = keys;
        this.position = 0;
        this.allowValueAccess = allowValueAccess;
        this.maxPosition = (maxPosition === false) ? values.size + 1 : maxPosition as number;
    }

    next() {
        return this.position < this.map.size ? {
            done: false,
            value: [...this.map.values()][this.position++]
        } : {
            done: true
        };
    }

    rewind() {
        this.position = 0;
    }
}

tape('TwingExtensionCore', (test) => {
    test.test('constructor', (test) => {
        let extension = new TwingExtensionCore();

        test.same(extension.getDefaultStrategy('foo'), 'html');

        extension = new TwingExtensionCore('name');

        test.same(extension.getDefaultStrategy('index.css'), 'css');
        test.same(extension.getDefaultStrategy('index.css.twig'), 'css');
        test.same(extension.getDefaultStrategy('index.html'), 'html');
        test.same(extension.getDefaultStrategy('index.html.twig'), 'html');
        test.same(extension.getDefaultStrategy('index.js'), 'js');
        test.same(extension.getDefaultStrategy('index.js.twig'), 'js');
        test.same(extension.getDefaultStrategy('index.txt'), false);
        test.same(extension.getDefaultStrategy('index.txt.twig'), false);

        test.end();
    });

    test.test('setTimezone', (test) => {
        let extension = new TwingExtensionCore();

        extension.setTimezone('UTC+1');

        test.same(extension.getTimezone(), 'UTC+1');

        test.end();
    });

    test.test('functions', (test) => {
        const env = new TwingEnvironmentNode(new TwingLoaderNull(), {});

        /**
         * @param test
         * @param name
         * @param {TwingFunction} f
         * @param fixture
         */
        const testAcceptedArguments = (test: tape.Test, name: string, f: TwingFunction, fixture: { name: string, arguments: TwingCallableArgument[] }) => {
            if (!fixture) {
                test.fail(`${name} function has no registered fixture`);
            } else {
                test.same(f.getAcceptedArgments(), fixture.arguments, `${name} function accepted arguments are as expected`);
            }
        };

        let fixtures = [
            {
                name: 'constant',
                arguments: [
                    {name: 'name'},
                    {name: 'object', defaultValue: null}
                ]
            },
            {
                name: 'cycle', arguments: [
                    {name: 'values'},
                    {name: 'position'}
                ]
            },
            {
                name: 'date', arguments: [
                    {name: 'date'},
                    {name: 'timezone'}
                ]
            },
            {
                name: 'dump', arguments: []
            },
            {
                name: 'include', arguments: [
                    {name: 'template'},
                    {name: 'variables', defaultValue: {}},
                    {name: 'with_context', defaultValue: true},
                    {name: 'ignore_missing', defaultValue: false},
                    {name: 'sandboxed', defaultValue: false}
                ]
            },
            {
                name: 'max', arguments: []
            },
            {
                name: 'min', arguments: []
            },
            {
                name: 'random', arguments: [
                    {name: 'values', defaultValue: null},
                    {name: 'max', defaultValue: null}
                ]
            },
            {
                name: 'range', arguments: [
                    {name: 'low'},
                    {name: 'high'},
                    {name: 'step'}
                ]
            },
            {
                name: 'source', arguments: [
                    {name: 'name'},
                    {name: 'ignore_missing', defaultValue: false}
                ]
            },
            {
                name: 'template_from_string', arguments: [
                    {name: 'template'},
                    {name: 'name', defaultValue: null}
                ]
            }
        ];

        for (let [name, f] of env.getFunctions()) {
            let fixture = fixtures.find((fixture) => {
                return fixture.name === name;
            });

            testAcceptedArguments(test, name, f, fixture);
        }

        test.end();
    });

    test.test('filters', (test) => {
        const env = new TwingEnvironmentNode(new TwingLoaderNull(), {});

        /**
         * @param test
         * @param name
         * @param {TwingFilter} f
         * @param fixture
         */
        const testAcceptedArguments = (test: tape.Test, name: string, f: TwingFilter, fixture: { name: string, arguments: TwingCallableArgument[] }) => {
            if (!fixture) {
                test.fail(`${name} filter has no registered fixture`);
            } else {
                test.same(f.getAcceptedArgments(), fixture.arguments, `${name} filter accepted arguments are as expected`);
            }
        };

        let fixtures = [
            {
                name: 'abs',
                arguments: []
            },
            {
                name: 'batch',
                arguments: [
                    {name: 'size'},
                    {name: 'fill', defaultValue: null},
                    {name: 'preserve_keys', defaultValue: true}
                ]
            },
            {
                name: 'capitalize',
                arguments: []
            },
            {
                name: 'column',
                arguments: [
                    {name: 'name'}
                ]
            },
            {
                name: 'convert_encoding',
                arguments: [
                    {name: 'to'},
                    {name: 'from'}
                ]
            },
            {
                name: 'date',
                arguments: [
                    {name: 'format', defaultValue: null},
                    {name: 'timezone', defaultValue: null}
                ]
            },
            {
                name: 'date_modify',
                arguments: [
                    {name: 'modifier'}
                ]
            },
            {
                name: 'default',
                arguments: [
                    {name: 'default'}
                ]
            },
            {
                name: 'e',
                arguments: [
                    {name: 'strategy'},
                    {name: 'charset'}
                ]
            },
            {
                name: 'escape',
                arguments: [
                    {name: 'strategy'},
                    {name: 'charset'}
                ]
            },
            {
                name: 'filter',
                arguments: [
                    {name: 'array'},
                    {name: 'arrow'}
                ]
            },
            {
                name: 'first',
                arguments: []
            },
            {
                name: 'format',
                arguments: []
            },
            {
                name: 'join',
                arguments: [
                    {name: 'glue', defaultValue: ''},
                    {name: 'and', defaultValue: null}
                ]
            },
            {
                name: 'json_encode',
                arguments: [
                    {name: 'options', defaultValue: null}
                ]
            },
            {
                name: 'keys',
                arguments: []
            },
            {
                name: 'last',
                arguments: []
            },
            {
                name: 'length',
                arguments: []
            },
            {
                name: 'lower',
                arguments: []
            },
            {
                name: 'map',
                arguments: [
                    {name: 'arrow'}
                ]
            },
            {
                name: 'merge',
                arguments: []
            },
            {
                name: 'nl2br',
                arguments: []
            },
            {
                name: 'number_format',
                arguments: [
                    {name: 'decimal'},
                    {name: 'decimal_point'},
                    {name: 'thousand_sep'}
                ]
            },
            {
                name: 'raw',
                arguments: []
            },
            {
                name: 'reduce',
                arguments: [
                    {name: 'arrow'},
                    {name: 'initial', defaultValue: null}
                ]
            },
            {
                name: 'replace',
                arguments: [
                    {name: 'from'}
                ]
            },
            {
                name: 'reverse',
                arguments: [
                    {name: 'preserve_keys', defaultValue: false}
                ]
            },
            {
                name: 'round',
                arguments: [
                    {name: 'precision', defaultValue: 0},
                    {name: 'method', defaultValue: 'common'}
                ]
            },
            {
                name: 'slice',
                arguments: [
                    {name: 'start'},
                    {name: 'length', defaultValue: null},
                    {name: 'preserve_keys', defaultValue: false}
                ]
            },
            {
                name: 'sort',
                arguments: []
            },
            {
                name: 'spaceless',
                arguments: []
            },
            {
                name: 'split',
                arguments: [
                    {name: 'delimiter'},
                    {name: 'limit'}
                ]
            },
            {
                name: 'striptags',
                arguments: [
                    {name: 'allowable_tags'}
                ]
            },
            {
                name: 'title',
                arguments: []
            },
            {
                name: 'trim',
                arguments: [
                    {name: 'character_mask', defaultValue: null},
                    {name: 'side', defaultValue: 'both'}
                ]
            },
            {
                name: 'upper',
                arguments: []
            },
            {
                name: 'url_encode',
                arguments: []
            },
        ];

        for (let [name, filter] of env.getFilters()) {
            let fixture = fixtures.find((fixture) => {
                return fixture.name === name;
            });

            testAcceptedArguments(test, name, filter, fixture);
        }

        test.end();
    });

    test.end();
});
