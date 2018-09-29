const {TwingEnvironmentNode: TwingEnvironment} = require('../../../build/lib/environment/node');

let nh = require('node-hook');

nh.hook('.twig', function (source, filename) {
    return `module.exports = ${JSON.stringify(source)};`;
});

nh.hook('.html', function (source, filename) {
    return `module.exports = ${JSON.stringify(source)};`;
});

let fixtures = require('./fixtures');

for (let fixture of fixtures) {
    let IntegrationTest = require(fixture);
    let integrationTest = new IntegrationTest();

    integrationTest.run(TwingEnvironment);
}
