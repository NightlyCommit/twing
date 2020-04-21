import * as tape from 'tape';
import {TwingNode, TwingNodeType} from "../../../../../src/lib/node";
import {TwingNodeExpressionConstant} from "../../../../../src/lib/node/expression/constant";
import {TwingCompiler} from "../../../../../src/lib/compiler";
import {MockEnvironment} from "../../../../mock/environment";
import {MockLoader} from "../../../../mock/loader";

tape('compiler', (test) => {
    test.test('subcompile method', (test) => {
        let node = new TwingNode(new Map([
            [0, new TwingNodeExpressionConstant(1, 1, 1)]
        ]), new Map(), 1, 1, 'foo');
        let compiler = new TwingCompiler(new MockEnvironment(new MockLoader()));

        test.same(compiler.compile(node).indent().subcompile(node).getSource(), '11', 'doesn\'t add indentation when raw is not set');
        test.same(compiler.compile(node).indent().subcompile(node, true).getSource(), '11', 'doesn\'t add indentation when raw is set to true');
        test.same(compiler.compile(node).indent().subcompile(node, false).getSource(), '1    1', 'add indentation when raw is set to false');

        test.end();
    });

    test.test('string method', (test) => {
        let node = new TwingNode(new Map(), new Map(), 1, 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironment(new MockLoader));

        test.same(compiler.compile(node).string('').getSource(), '\`\`', 'supports empty parameter');
        test.same(compiler.compile(node).string(null).getSource(), '\`\`', 'supports null parameter');
        test.same(compiler.compile(node).string(undefined).getSource(), '\`\`', 'supports undefined parameter');
        test.same(compiler.compile(node).string('${foo}').getSource(), '\`\\${foo}\`', 'escape interpolation delimiter');
        test.same(compiler.compile(node).string('${foo}${foo}').getSource(), '\`\\${foo}\\${foo}\`', 'escape interpolation delimiter globally');

        test.end();
    });

    test.test('repr method', (test) => {
        let node = new TwingNode(new Map(), new Map(), 1, 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironment(new MockLoader));

        test.same(compiler.compile(node).repr({1: 'a', 'b': 2, 'c': '3'}).getSource(), '{"1": \`a\`, "b": 2, "c": \`3\`}', 'supports hashes');
        test.same(compiler.compile(node).repr(undefined).getSource(), 'undefined', 'supports undefined');
        test.same(compiler.compile(node).repr(new Map([[0, 1], [1, 2]])).getSource(), 'new Map([[0, 1], [1, 2]])', 'supports ES6 maps');

        test.end();
    });

    test.test('outdent method', function(test) {
        let node = new TwingNode(new Map(), new Map(), 1, 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironment(new MockLoader));

        try {
            compiler.compile(node).outdent();

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Unable to call outdent() as the indentation would become negative.', 'throws an error if the indentation becomes negative');
        }

        test.end();
    });

    test.test('addSourceMapEnter', function(test) {
        let compiler = new TwingCompiler(new MockEnvironment(new MockLoader, {
            source_map: true
        }));

        class CustomNode extends TwingNode {
            constructor(line: number, column: number) {
                super(new Map(), new Map(), line, column);

                this.type = TwingNodeType.BODY;
            }

            compile(compiler: TwingCompiler) {
                compiler.addSourceMapEnter(this);
            }
        }

        test.same(compiler.compile(new CustomNode(1, 1)).getSource(), 'this.env.enterSourceMapBlock(1, 1, `body`, this.getSourceContext(), outputBuffer);\n');

        test.end();
    });

    test.end();
});
