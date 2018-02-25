import {Test} from "tape";
import {TwingMap} from "../../../../src/map";
import {TwingNodeFlush} from "../../../../src/node/flush";
import {TwingTestCompilerStub} from "../../../compiler-stub";
import {TwingNodeType} from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/flush', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeFlush(1, 'foo');

        test.same(node.getNodes(), new TwingMap());
        test.same(node.getType(), TwingNodeType.FLUSH);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let node = new TwingNodeFlush(1, 'foo');
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.flush();
`);

        test.end();
    });

    test.end();
});