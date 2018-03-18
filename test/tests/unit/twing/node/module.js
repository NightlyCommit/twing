const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeExpressionAssignName = require('../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeImport = require('../../../../../lib/twing/node/import').TwingNodeImport;
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingSource = require('../../../../../lib/twing/source').TwingSource;
const TwingNodeModule = require('../../../../../lib/twing/node/module').TwingNodeModule;
const TwingMap = require('../../../../../lib/twing/map').TwingMap;
const TwingNodeExpressionConditional = require('../../../../../lib/twing/node/expression/conditional').TwingNodeExpressionConditional;
const TwingNodeSet = require('../../../../../lib/twing/node/set').TwingNodeSet;
const TwingTestEnvironmentStub = require('../../../../mock/environment');
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;
const TwingTestMockLoader = require('../../../../mock/loader');

const tap = require('tap');

tap.test('node/module', function (test) {
    test.test('constructor', function (test) {
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

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('basic', function (test) {
            let body = new TwingNodeText('foo', 1);
            let parent = null;
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let node = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            test.same(compiler.compile(node).getSource(), `const Twing = require('twing/lib/runtime');

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

        test.test('with parent', function (test) {
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

            test.same(compiler.compile(node).getSource(), `const Twing = require('twing/lib/runtime');

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
        context.getAssignmentProxy()["macro"] = this.loadTemplate("foo.twig", "foo.twig", 2);
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

        test.test('with conditional parent, set body and debug', function (test) {
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

            let loader = new TwingTestMockLoader();
            let twing = new TwingTestEnvironmentStub(loader, {debug: true});
            let node = new TwingNodeModule(body, extends_, blocks, macros, traits, [], source);

            compiler = new TwingTestMockCompiler(twing);

            test.same(compiler.compile(node).getSource(), `const Twing = require('twing/lib/runtime');

module.exports = {};


/* foo.twig */
module.exports.__TwingTemplate_foo = class __TwingTemplate_foo extends Twing.TwingTemplate {
    doGetParent(context) {
        // line 2
        return this.loadTemplate(((true) ? ("foo") : ("foo")), "foo.twig", 2);
    }

    async doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 4
        context.getAssignmentProxy()["foo"] = "foo";
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
