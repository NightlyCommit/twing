const {
    TwingNode,
    TwingNodeFor,
    TwingNodeType,
    TwingNodeExpressionConstant,
    TwingNodeExpressionAssignName,
    TwingNodeExpressionName,
    TwingNodePrint
} = require('../../../../../../build/index');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/for', function (test) {
    test.test('constructor', function (test) {
        let keyTarget = new TwingNodeExpressionAssignName('key', 1, 1);
        let valueTarget = new TwingNodeExpressionAssignName('item', 1, 1);
        let seq = new TwingNodeExpressionName('items', 1, 1);
        let ifexpr = new TwingNodeExpressionConstant(true, 1, 1);

        let bodyNodes = new Map([
            [0, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes, new Map(), 1, 1);
        let else_ = null;

        let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);

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
        node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1, 1);
        node.setAttribute('with_loop', false);

        test.same(node.getNode('else'), else_);
        test.same(node.getType(), TwingNodeType.FOR);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('without loop', function (test) {
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

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set('_parent', Runtime.clone(context));

(() => {
    let c = Runtime.twingEnsureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', Runtime.clone(context));
    }
    else {
        context.set('_seq', c);
    }
})();

Runtime.each.bind(this)(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`key\`] = __key__;
    context.proxy[\`item\`] = __value__;
    Runtime.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
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

        test.test('with loop', function (test) {
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

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set('_parent', Runtime.clone(context));

(() => {
    let c = Runtime.twingEnsureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', Runtime.clone(context));
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
if (Array.isArray(context.get('_seq')) || (typeof context.get('_seq') === 'object' && Runtime.isCountable(context.get('_seq')))) {
    let length = Runtime.count(context.get('_seq'));
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
Runtime.each.bind(this)(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    Runtime.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
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

        test.test('with ifexpr', function (test) {
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

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set('_parent', Runtime.clone(context));

(() => {
    let c = Runtime.twingEnsureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', Runtime.clone(context));
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
Runtime.each.bind(this)(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    if (true) {
        Runtime.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
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

        test.test('with else', function (test) {
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

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set('_parent', Runtime.clone(context));

(() => {
    let c = Runtime.twingEnsureTraversable((context.has(\`items\`) ? context.get(\`items\`) : null));

    if (c === context) {
        context.set('_seq', Runtime.clone(context));
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
if (Array.isArray(context.get('_seq')) || (typeof context.get('_seq') === 'object' && Runtime.isCountable(context.get('_seq')))) {
    let length = Runtime.count(context.get('_seq'));
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
Runtime.each.bind(this)(context.get('_seq'), (__key__, __value__) => {
    context.proxy[\`k\`] = __key__;
    context.proxy[\`v\`] = __value__;
    Runtime.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
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
    Runtime.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
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
