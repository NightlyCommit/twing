const TwingNodeTraverser = require("../../../../lib/twing/node-traverser").TwingNodeTraverser;
const TwingLoaderArray = require("../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../lib/twing/environment").TwingEnvironment;
const TwingNode = require("../../../../lib/twing/node").TwingNode;

const tap = require('tap');

class TwingTestNodeVisitorRemoveVisitor {
    constructor(nodeToRemove) {
        this.TwingNodeVisitorInterfaceImpl = {
            enterNode(node) {
                return node;
            },
            leaveNode(node) {
                if (node === nodeToRemove) {
                    return null;
                }

                return node;
            }
        };
    }
}

tap.test('node-traverser', function (test) {
    test.test('constructor', function (test) {
        test.doesNotThrow(function() {
            new TwingNodeTraverser(new TwingEnvironment(new TwingLoaderArray({})));
        });

        test.end();
    });

    test.test('traverseForVisitor', function (test) {
        let traverser = new TwingNodeTraverser(new TwingEnvironment(new TwingLoaderArray({})));

        let nodeToRemove = new TwingNode();
        let visitor = new TwingTestNodeVisitorRemoveVisitor(nodeToRemove);
        let node = traverser.traverseForVisitor(visitor, new TwingNode(new Map([[0, nodeToRemove]])));

        test.same(node.getNodes(), new Map());

        test.end();
    });


    test.end();
});