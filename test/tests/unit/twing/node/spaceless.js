const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeSpaceless = require('../../../../../lib/twing/node/spaceless').TwingNodeSpaceless;
const TwingMap = require('../../../../../lib/twing/map').TwingMap;
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingNodeType = require('../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/spaceless', function (test) {
    test.test('constructor', function (test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getType(), TwingNodeType.SPACELESS);

        test.end();
    });

    test.test('compile', function (test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.obStart();
Twing.echo("<div>   <div>   foo   </div>   </div>");
Twing.echo(Twing.obGetClean().replace(/>\\s+</g, '><').trim());
`);

        test.end();
    });

    test.end();
});
