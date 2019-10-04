import * as tape from 'tape';
import {TwingNodeForLoop} from "../../../../../../src/lib/node/for-loop";
import {TwingCompiler} from "../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";

tape('node/for-loop', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeForLoop(1, 1);

        test.equals(node.getNodeTag(), null);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        test.test('with_loop', (test) => {
            let node = new TwingNodeForLoop(1, 1);
            let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

            node.setAttribute('with_loop', true);

            test.same(compiler.compile(node).getSource(), `(() => {
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
`);

            test.end();
        });

        test.end();
    });

    test.end();
});