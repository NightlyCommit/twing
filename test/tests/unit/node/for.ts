import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeDo from "../../../../src/node/do";
import TwingNodeExpressionAssignName from "../../../../src/node/expression/assign-name";
import TwingNodeExpressionName from "../../../../src/node/expression/name";
import TwingMap from "../../../../src/map";
import TwingNodePrint from "../../../../src/node/print";
import TwingNode from "../../../../src/node";
import TwingNodeFor from "../../../../src/node/for";

const tap = require('tap');

tap.test('node/for', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let keyTarget = new TwingNodeExpressionAssignName('key', 1);
        let valueTarget = new TwingNodeExpressionAssignName('item', 1);
        let seq = new TwingNodeExpressionName('items', 1);
        let ifexpr = new TwingNodeExpressionConstant(true, 1);

        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

        let body = new TwingNode(bodyNodes, new TwingMap(), 1);
        let else_: TwingNode = null;

        let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);

        test.same(node.getNode('key_target'), keyTarget);
        test.same(node.getNode('value_target'), valueTarget);
        test.same(node.getNode('seq'), seq);
        test.true(node.getAttribute('ifexpr'));
        test.same(node.getNode('body').constructor.name, 'TwingNodeIf');
        test.same(node.getNode('body').getNode('tests').getNode(1).getNode(0), body);
        test.false(node.hasNode('else'));

        else_ = new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1);
        node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);
        node.setAttribute('with_loop', false);

        test.same(node.getNode('else'), else_);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('without loop', function(test: Test) {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('key', 1);
            let valueTarget = new TwingNodeExpressionAssignName('item', 1);
            let seq = new TwingNodeExpressionName('items', 1);
            let ifexpr = null;

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let body = new TwingNode(bodyNodes, new TwingMap(), 1);
            let else_: TwingNode = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);

            node.setAttribute('with_loop', false);

            test.same(compiler.compile(node).getSource(), `// line 1
context.set('_parent', context.clone());
context.set('_seq',  Twing.twingEnsureTraversable((context.has("items") ? context.get("items") : null)));
for (let [__key__, __value__] of context.get('_seq')) {
    Twing.getContextProxy(context)["key"] = __key__;
    Twing.getContextProxy(context)["item"] = __value__;
    Twing.echo((context.has("foo") ? context.get("foo") : null));
}
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

        test.test('with loop', function(test: Test) {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1);
            let seq = new TwingNodeExpressionName('items', 1);
            let ifexpr = null;

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let body = new TwingNode(bodyNodes, new TwingMap(), 1);
            let else_: TwingNode = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `// line 1
context.set('_parent', context.clone());
context.set('_seq',  Twing.twingEnsureTraversable((context.has("items") ? context.get("items") : null)));
context.set('loop', new Twing.TwingMap([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
if (Twing.isCountable(context.get('_seq'))) {
    let length = context.get('_seq').size;
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
for (let [__key__, __value__] of context.get('_seq')) {
    Twing.getContextProxy(context)["k"] = __key__;
    Twing.getContextProxy(context)["v"] = __value__;
    Twing.echo((context.has("foo") ? context.get("foo") : null));
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

        test.test('with ifexpr', function(test: Test) {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1);
            let seq = new TwingNodeExpressionName('items', 1);
            let ifexpr = new TwingNodeExpressionConstant(true, 1);

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let body = new TwingNode(bodyNodes, new TwingMap(), 1);
            let else_: TwingNode = null;

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `// line 1
context.set('_parent', context.clone());
context.set('_seq',  Twing.twingEnsureTraversable((context.has("items") ? context.get("items") : null)));
context.set('loop', new Twing.TwingMap([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
for (let [__key__, __value__] of context.get('_seq')) {
    Twing.getContextProxy(context)["k"] = __key__;
    Twing.getContextProxy(context)["v"] = __value__;
    if (true) {
        Twing.echo((context.has("foo") ? context.get("foo") : null));
        (() => {
            let loop = context.get('loop');
            loop.set('index0', loop.get('index0') + 1);
            loop.set('index', loop.get('index') + 1);
            loop.set('first', false);
        })();
    }
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

        test.test('with else', function(test: Test) {
            // ...
            let keyTarget = new TwingNodeExpressionAssignName('k', 1);
            let valueTarget = new TwingNodeExpressionAssignName('v', 1);
            let seq = new TwingNodeExpressionName('items', 1);
            let ifexpr = null;

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let body = new TwingNode(bodyNodes, new TwingMap(), 1);
            let else_ = new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1);

            let node = new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, else_, 1);

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `// line 1
context.set('_parent', context.clone());
context.set('_seq',  Twing.twingEnsureTraversable((context.has("items") ? context.get("items") : null)));
context.set('_iterated', false);
context.set('loop', new Twing.TwingMap([
  ['parent', context.get('_parent')],
  ['index0', 0],
  ['index', 1],
  ['first', true]
]));
if (Twing.isCountable(context.get('_seq'))) {
    let length = context.get('_seq').size;
    let loop = context.get('loop');
    loop.set('revindex0', length - 1);
    loop.set('revindex', length);
    loop.set('length', length);
    loop.set('last', (length === 1));
}
for (let [__key__, __value__] of context.get('_seq')) {
    Twing.getContextProxy(context)["k"] = __key__;
    Twing.getContextProxy(context)["v"] = __value__;
    Twing.echo((context.has("foo") ? context.get("foo") : null));
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
}
if (context.get('_iterated') === false) {
    Twing.echo((context.has("foo") ? context.get("foo") : null));
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