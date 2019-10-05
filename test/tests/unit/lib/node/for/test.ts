import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionAssignName} from "../../../../../../src/lib/node/expression/assign-name";
import {TwingNodeExpressionName} from "../../../../../../src/lib/node/expression/name";
import {TwingNodePrint} from "../../../../../../src/lib/node/print";
import {TwingNode, TwingNodeType} from "../../../../../../src/lib/node";
import {TwingNodeFor} from "../../../../../../src/lib/node/for";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/for', (test) => {
    test.test('constructor', (test) => {
        let keyTarget = new TwingNodeExpressionAssignName('key', 1, 1);
        let valueTarget = new TwingNodeExpressionAssignName('item', 1, 1);
        let seq = new TwingNodeExpressionName('items', 1, 1);
        let ifExpr = new TwingNodeExpressionConstant(true, 1, 1);

        let bodyNodes = new Map([
            [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes, new Map(), 1, 1);
        let else_ = null;

        let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifExpr, body, else_, 1, 1);

        test.same(node.getNode('key_target'), keyTarget);
        test.same(node.getNode('value_target'), valueTarget);
        test.same(node.getNode('seq'), seq);
        test.true(node.getAttribute('ifexpr'));
        test.same(node.getNode('body').constructor.name, 'TwingNodeIf');
        test.same(node.getNode('body').getNode('tests').getNode(1).getNode(0), body);
        test.false(node.hasNode('else'));
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        else_ = new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1);
        node = new TwingNodeFor(keyTarget, valueTarget, seq, ifExpr, body, else_, 1, 1);
        node.setAttribute('with_loop', false);

        test.same(node.getNode('else'), else_);
        test.same(node.getType(), TwingNodeType.FOR);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        test.test('without loop', (test) => {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('key', 1, 1);
            let valueTarget = new TwingNodeExpressionAssignName('item', 1, 1);
            let seq = new TwingNodeExpressionName('items', 1, 1);
            let ifexpr = null;

            let bodyNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let body = new TwingNode(bodyNodes, new Map(), 1, 1);
            let else_ = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);

            node.setAttribute('with_loop', false);

            test.same(compiler.compile(node).getSource(), `context.set('_parent', context.clone());

(() => {
    let c = this.ensureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', context.clone());
    }
    else {
        context.set('_seq', c);
    }
})();

this.iterate(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`key\`] = __key__;
    context.proxy[\`item\`] = __value__;
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
});
(() => {
    let parent = context.get('_parent');
    context.delete('_seq');
    context.delete('_iterated');
    context.delete('key');
    context.delete('item');
    context.delete('_parent');
    context.delete('loop');
    for (let [k, v] of parent) {
        if (!context.has(k)) {
            context.set(k, v);
        }
    }
})();
`);

            test.end();
        });

        test.test('with loop', (test) => {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1, 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1, 1);
            let seq = new TwingNodeExpressionName('items', 1, 1);
            let ifexpr = null;

            let bodyNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let body = new TwingNode(bodyNodes, new Map(), 1, 1);
            let else_ = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `context.set('_parent', context.clone());

(() => {
    let c = this.ensureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', context.clone());
    }
    else {
        context.set('_seq', c);
    }
})();

context.set('loop', new Map([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
if ((typeof context.get('_seq') === 'object') && this.isCountable(context.get('_seq'))) {
    let length = this.count(context.get('_seq'));
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
this.iterate(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
    (() => {
        let loop = context.get('loop');
        loop.set('index0', loop.get('index0') + 1);
        loop.set('index', loop.get('index') + 1);
        loop.set('first', false);
        if (loop.has('length')) {
            loop.set('revindex0', loop.get('revindex0') - 1);
            loop.set('revindex', loop.get('revindex') - 1);
            loop.set('last', loop.get('revindex0') === 0);
        }
    })();
});
(() => {
    let parent = context.get('_parent');
    context.delete('_seq');
    context.delete('_iterated');
    context.delete('k');
    context.delete('v');
    context.delete('_parent');
    context.delete('loop');
    for (let [k, v] of parent) {
        if (!context.has(k)) {
            context.set(k, v);
        }
    }
})();
`);

            test.end();
        });

        test.test('with ifexpr', (test) => {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1, 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1, 1);
            let seq = new TwingNodeExpressionName('items', 1, 1);
            let ifexpr = new TwingNodeExpressionConstant(true, 1, 1);

            let bodyNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let body = new TwingNode(bodyNodes, new Map(), 1, 1);
            let else_ = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `context.set('_parent', context.clone());

(() => {
    let c = this.ensureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', context.clone());
    }
    else {
        context.set('_seq', c);
    }
})();

context.set('loop', new Map([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
this.iterate(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    if (true) {
        this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
        (() => {
            let loop = context.get('loop');
            loop.set('index0', loop.get('index0') + 1);
            loop.set('index', loop.get('index') + 1);
            loop.set('first', false);
        })();
    }
});
(() => {
    let parent = context.get('_parent');
    context.delete('_seq');
    context.delete('_iterated');
    context.delete('k');
    context.delete('v');
    context.delete('_parent');
    context.delete('loop');
    for (let [k, v] of parent) {
        if (!context.has(k)) {
            context.set(k, v);
        }
    }
})();
`);

            test.end();
        });

        test.test('with else', (test) => {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1, 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1, 1);
            let seq = new TwingNodeExpressionName('items', 1, 1);
            let ifexpr = null;

            let bodyNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let body = new TwingNode(bodyNodes, new Map(), 1, 1);
            let else_ = new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1);

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `context.set('_parent', context.clone());

(() => {
    let c = this.ensureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', context.clone());
    }
    else {
        context.set('_seq', c);
    }
})();

context.set('_iterated', false);
context.set('loop', new Map([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
if ((typeof context.get('_seq') === 'object') && this.isCountable(context.get('_seq'))) {
    let length = this.count(context.get('_seq'));
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
this.iterate(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
    context.set('_iterated',  true);
    (() => {
        let loop = context.get('loop');
        loop.set('index0', loop.get('index0') + 1);
        loop.set('index', loop.get('index') + 1);
        loop.set('first', false);
        if (loop.has('length')) {
            loop.set('revindex0', loop.get('revindex0') - 1);
            loop.set('revindex', loop.get('revindex') - 1);
            loop.set('last', loop.get('revindex0') === 0);
        }
    })();
});
if (context.get('_iterated') === false) {
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
}
(() => {
    let parent = context.get('_parent');
    context.delete('_seq');
    context.delete('_iterated');
    context.delete('k');
    context.delete('v');
    context.delete('_parent');
    context.delete('loop');
    for (let [k, v] of parent) {
        if (!context.has(k)) {
            context.set(k, v);
        }
    }
})();
`);

            test.end();
        });

        test.end();
    });

    test.end();
});
