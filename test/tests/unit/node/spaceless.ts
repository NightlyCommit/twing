import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeDo from "../../../../src/node/do";
import TwingNodeSpaceless from "../../../../src/node/spaceless";
import TwingMap from "../../../../src/map";
import TwingNodeText from "../../../../src/node/text";
import TwingNode from "../../../../src/node";

const tap = require('tap');

tap.test('node/spaceless', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1);

        test.same(node.getNode('body'), body);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.obStart();
Twing.echo("<div>   <div>   foo   </div>   </div>");
Twing.echo(Twing.obGetClean().replace(/>\\s+</g, '><').trim());
`);

        test.end();
    });

    test.end();
});