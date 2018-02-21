import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingMap from "../../../../src/map";
import TwingNodeText from "../../../../src/node/text";
import TwingNode from "../../../../src/node";
import TwingNodeAutoEscape from "../../../../src/node/auto-escape";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/autoescape', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('foo', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1);

        test.same(node.getNode('body'), body);
        test.true(node.getAttribute('value'));
        test.same(node.getType(), TwingNodeType.AUTO_ESCAPE);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('foo', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});