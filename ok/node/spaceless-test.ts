import * as tape from 'tape';
import TwingNodeSpaceless from "../../src/node/spaceless";
import TwingNode from "../../src/node";
import TwingMap from "../../src/map";
import TwingNodeText from "../../src/node/text";
import TestNodeTestCase from "./test-case";

let nodeTestCase = new TestNodeTestCase();

tape('node/spaceless', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let body = new TwingNode(new TwingMap([[0, new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1)]]));
        let node = new TwingNodeSpaceless(body, 1);

        test.equal(body, node.getNode('body'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let body = new TwingNode(new TwingMap([[0, new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1)]]));
        let node = new TwingNodeSpaceless(body, 1);

        nodeTestCase.assertNodeCompilation(test, node,
            '// line 1\n' +
            'this.obStart();\n' +
            'this.obEcho(\'<div>   <div>   foo   </div>   </div>\');\n' +
            'this.obEcho(this.obGetClean().replace(/>\\s+</g, \'><\').trim());'
        );

        test.end();
    });
});
