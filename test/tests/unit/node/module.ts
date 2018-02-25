import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../compiler-stub";
import {TwingNodeExpressionConstant} from "../../../../src/node/expression/constant";
import {TwingNodeExpressionAssignName} from "../../../../src/node/expression/assign-name";
import {TwingNodeImport} from "../../../../src/node/import";
import {TwingNodeText} from "../../../../src/node/text";
import {TwingNode} from "../../../../src/node";
import {TwingSource} from "../../../../src/source";
import {TwingNodeModule} from "../../../../src/node/module";
import {TwingMap} from "../../../../src/map";
import {TwingNodeExpressionConditional} from "../../../../src/node/expression/conditional";
import {TwingNodeSet} from "../../../../src/node/set";
import {TwingTestEnvironmentStub} from "../../../environment-stub";
import {TwingNodeType} from "../../../../src/node-type";
import {TwingTestLoaderStub} from "../../../loader-stub";

const tap = require('tap');

tap.test('node/module', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let body = new TwingNodeText('foo', 1);
        let parent = new TwingNodeExpressionConstant('layout.twig', 1);
        let blocks = new TwingNode();
        let macros = new TwingNode();
        let traits = new TwingNode();
        let source = new TwingSource('{{ foo }}', 'foo.twig');
        let node = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

        test.same(node.getNode('body'), body);
        test.same(node.getNode('blocks'), blocks);
        test.same(node.getNode('macros'), macros);
        test.same(node.getNode('parent'), parent);
        test.same(node.getTemplateName(), source.getName());
        test.same(node.getType(), TwingNodeType.MODULE);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('basic', function (test: Test) {
            let body = new TwingNodeText('foo', 1);
            let parent: TwingNode = null;
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let node = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            test.same(compiler.compile(node).getSource(), `const Twing = require("twing");

module.exports = {};


/* foo.twig */
module.exports.__TwingTemplate_foo = class __TwingTemplate_foo extends Twing.TwingTemplate {
    constructor(env) {
        super(env);

        this.parent = false;

        this.blocks = new Twing.TwingMap([
        ]);
    }

    async doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 1
        Twing.echo("foo");
    }

    getTemplateName() {
        return "foo.twig";
    }

    getDebugInfo() {
        return new Map([[19,1]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(\`\`, "foo.twig", "");
    }
};

`);

            test.end();
        });

        test.test('with parent', function (test: Test) {
            let import_ = new TwingNodeImport(new TwingNodeExpressionConstant('foo.twig', 1), new TwingNodeExpressionAssignName('macro', 1), 2);

            let bodyNodes = new TwingMap();

            bodyNodes.push(import_);

            let body = new TwingNode(bodyNodes);
            let extends_ = new TwingNodeExpressionConstant('layout.twig', 1);

            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');

            let node = new TwingNodeModule(body, extends_, blocks, macros, traits, [], source);

            test.same(compiler.compile(node).getSource(), `const Twing = require("twing");

module.exports = {};


/* foo.twig */
module.exports.__TwingTemplate_foo = class __TwingTemplate_foo extends Twing.TwingTemplate {
    constructor(env) {
        super(env);

        // line 1
        this.parent = this.loadTemplate("layout.twig", "foo.twig", 1);
        this.blocks = new Twing.TwingMap([
        ]);
    }

    doGetParent(context) {
        return "layout.twig";
    }

    async doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 2
        Twing.getContextProxy(context)["macro"] = this.loadTemplate("foo.twig", "foo.twig", 2);
        // line 1
        await this.parent.display(context, this.blocks.merge(blocks));
    }

    getTemplateName() {
        return "foo.twig";
    }

    isTraitable() {
        return false;
    }

    getDebugInfo() {
        return new Map([[25,1], [23,2], [12,1]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(\`\`, "foo.twig", "");
    }
};

`);

            test.end();
        });

        test.test('with conditional parent, set body and debug', function (test: Test) {
            let setNames = new TwingMap();

            setNames.push(new TwingNodeExpressionAssignName('foo', 4));

            let setValues = new TwingMap();

            setValues.push(new TwingNodeExpressionConstant('foo', 4));

            let set = new TwingNodeSet(false, new TwingNode(setNames), new TwingNode(setValues), 4);

            let bodyNodes = new TwingMap();

            bodyNodes.push(set);

            let body = new TwingNode(bodyNodes);
            let extends_ = new TwingNodeExpressionConditional(
                new TwingNodeExpressionConstant(true, 2),
                new TwingNodeExpressionConstant('foo', 2),
                new TwingNodeExpressionConstant('foo', 2),
                2
            );

            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');

            let loader = new TwingTestLoaderStub();
            let twing = new TwingTestEnvironmentStub(loader, {debug: true});
            let node = new TwingNodeModule(body, extends_, blocks, macros, traits, [], source);

            compiler = new TwingTestCompilerStub(twing);

            test.same(compiler.compile(node).getSource(), `const Twing = require("twing");

module.exports = {};


/* foo.twig */
module.exports.__TwingTemplate_foo = class __TwingTemplate_foo extends Twing.TwingTemplate {
    doGetParent(context) {
        // line 2
        return this.loadTemplate(((true) ? ("foo") : ("foo")), "foo.twig", 2);
    }

    async doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 4
        Twing.getContextProxy(context)["foo"] = "foo";
        // line 2
        await this.getParent(context).display(context, this.blocks.merge(blocks));
    }

    getTemplateName() {
        return "foo.twig";
    }

    isTraitable() {
        return false;
    }

    getDebugInfo() {
        return new Map([[17,2], [15,4], [10,2]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(\`{{ foo }}\`, "foo.twig", "");
    }
};

`);

            test.end();
        });

        test.end();
    });

    test.end();
});
