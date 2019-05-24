const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingTestEnvironmentStub = require('../../../../mock/environment');
const TwingTestMockLoader = require('../../../../mock/loader');

const tap = require('tape');
const {TwingNodeSet} = require("../../../../../build/node/set");
const {TwingNodeExpressionConditional} = require("../../../../../build/node/expression/conditional");
const {TwingNodeExpressionAssignName} = require("../../../../../build/node/expression/assign-name");
const {TwingNodeImport} = require("../../../../../build/node/import");
const {TwingSource} = require("../../../../../build/source");
const {TwingNodeText} = require("../../../../../build/node/text");
const {TwingNodeModule} = require("../../../../../build/node/module");
const {TwingNodeExpressionConstant} = require("../../../../../build/node/expression/constant");
const {TwingNodeType, TwingNode} = require("../../../../../build/node");

tap.test('node/module', function (test) {
    test.test('constructor', function (test) {
        let body = new TwingNodeText('foo', 1, 1);
        let parent = new TwingNodeExpressionConstant('layout.twig', 1, 1);
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
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(),1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('basic', function (test) {
            let body = new TwingNodeText('foo', 1, 1);
            let parent = null;
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let node = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            test.same(compiler.compile(node).getSource(), `module.exports = (Runtime) => {
    let templates = {};
    

    /* foo.twig */
    templates.__TwingTemplate_foo = class __TwingTemplate_foo extends Runtime.TwingTemplate {
        constructor(env) {
            super(env);

            this.source = this.getSourceContext();

            this.parent = false;

            this.blocks = new Map([
            ]);
        }

        doDisplay(context, blocks = new Map()) {
            // line 1, column 1
            Runtime.echo(\`foo\`);
        }

        getTemplateName() {
            return \`foo.twig\`;
        }

        getDebugInfo() {
            return new Map([[20, {"line": 1, "column": 1}]]);
        }

        getSourceContext() {
            return new Runtime.TwingSource(\`\`, \`foo.twig\`, \`\`);
        }
    };

    return templates;
};`);

            test.end();
        });

        test.test('with parent', function (test) {
            let import_ = new TwingNodeImport(new TwingNodeExpressionConstant('foo.twig', 1, 1), new TwingNodeExpressionAssignName('macro', 1, 1), 2, 1);

            let bodyNodes = new Map([
                [0, import_]
            ]);

            let body = new TwingNode(bodyNodes);
            let extends_ = new TwingNodeExpressionConstant('layout.twig', 1, 1);

            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');

            let node = new TwingNodeModule(body, extends_, blocks, macros, traits, [], source);

            test.same(compiler.compile(node).getSource(), `module.exports = (Runtime) => {
    let templates = {};
    

    /* foo.twig */
    templates.__TwingTemplate_foo = class __TwingTemplate_foo extends Runtime.TwingTemplate {
        constructor(env) {
            super(env);

            this.source = this.getSourceContext();

            // line 1, column 1
            this.parent = this.loadTemplate(\`layout.twig\`, \`foo.twig\`, 1);
            this.blocks = new Map([
            ]);
        }

        doGetParent(context) {
            return \`layout.twig\`;
        }

        doDisplay(context, blocks = new Map()) {
            // line 2, column 1
            context.set(\`macro\`, this.loadTemplate(\`foo.twig\`, \`foo.twig\`, 2));
            // line 1, column 1
            this.parent.display(context, Runtime.merge(this.blocks, blocks));
        }

        getTemplateName() {
            return \`foo.twig\`;
        }

        isTraitable() {
            return false;
        }

        getDebugInfo() {
            return new Map([[26, {"line": 1, "column": 1}], [24, {"line": 2, "column": 1}], [13, {"line": 1, "column": 1}]]);
        }

        getSourceContext() {
            return new Runtime.TwingSource(\`\`, \`foo.twig\`, \`\`);
        }
    };

    return templates;
};`);

            test.end();
        });

        test.test('with conditional parent, set body and debug', function (test) {
            let setNames = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 4, 1)]
            ]);

            let setValues = new Map([
                [0, new TwingNodeExpressionConstant('foo', 4, 1)]
            ]);

            let set = new TwingNodeSet(false, new TwingNode(setNames), new TwingNode(setValues), 4, 1);

            let bodyNodes = new Map([
                [0, set]
            ]);

            let body = new TwingNode(bodyNodes);
            let extends_ = new TwingNodeExpressionConditional(
                new TwingNodeExpressionConstant(true, 2, 1),
                new TwingNodeExpressionConstant('foo', 2, 1),
                new TwingNodeExpressionConstant('foo', 2, 1),
                2, 1
            );

            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');

            let loader = new TwingTestMockLoader();
            let twing = new TwingTestEnvironmentStub(loader, {debug: true});
            let node = new TwingNodeModule(body, extends_, blocks, macros, traits, [], source);

            compiler = new TwingTestMockCompiler(twing);

            test.same(compiler.compile(node).getSource(), `module.exports = (Runtime) => {
    let templates = {};
    

    /* foo.twig */
    templates.__TwingTemplate_foo = class __TwingTemplate_foo extends Runtime.TwingTemplate {
        constructor(env) {
            super(env);

            this.source = this.getSourceContext();

            this.blocks = new Map([
            ]);
        }

        doGetParent(context) {
            // line 2, column 1
            return this.loadTemplate(((true) ? (\`foo\`) : (\`foo\`)), \`foo.twig\`, 2);
        }

        doDisplay(context, blocks = new Map()) {
            // line 4, column 1
            context.set(\`foo\`, \`foo\`);
            // line 2, column 1
            this.getParent(context).display(context, Runtime.merge(this.blocks, blocks));
        }

        getTemplateName() {
            return \`foo.twig\`;
        }

        isTraitable() {
            return false;
        }

        getDebugInfo() {
            return new Map([[25, {"line": 2, "column": 1}], [23, {"line": 4, "column": 1}], [18, {"line": 2, "column": 1}]]);
        }

        getSourceContext() {
            return new Runtime.TwingSource(\`{{ foo }}\`, \`foo.twig\`, \`\`);
        }
    };

    return templates;
};`);

            test.end();
        });

        test.end();
    });

    test.end();
});
