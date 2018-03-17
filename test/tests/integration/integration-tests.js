const TwingLoaderArray = require('../../../lib/twing/loader/array').TwingLoaderArray;
const TwingEnvironment = require('../../../lib/twing/environment').TwingEnvironment;

const tap = require('tap');
const path = require('path');
const finder = require('fs-finder');
const merge = require('merge');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('./lib/runtime.js'));

let nh = require('node-hook');

nh.hook('.twig', function (source, filename) {
    return `module.exports = ${JSON.stringify(source)};`;
});

nh.hook('.html', function (source, filename) {
    return `module.exports = ${JSON.stringify(source)};`;
});

// gather fixtures
let directory = path.resolve('test/tests/integration/fixtures');

let files = finder.from(directory).findFiles('test.js');

tap.test('integration tests', async function (test) {
    for (let file of files) {
        let dirname = path.dirname(file);

        let IntegrationTest = require(file);
        let integrationTest = new IntegrationTest(path.relative(directory, dirname));
        let testMessage = integrationTest.getName() !== integrationTest.getDescription() ? `${integrationTest.getName()}: ${integrationTest.getDescription()}` : integrationTest.getDescription();

        // templates
        let templates = integrationTest.getTemplates();

        // config
        let config = merge({
            strict_variables: true,
            cache: 'tmp'
        }, integrationTest.getConfig());

        let loader = new TwingLoaderArray(templates);
        let twing = new TwingEnvironment(loader, config);

        integrationTest.setTwing(twing);

        // extensions
        integrationTest.getExtensions().forEach(function (extension) {
            twing.addExtension(extension);
        });

        // globals
        integrationTest.getGlobals().forEach(function (value, key) {
            twing.addGlobal(key, value);
        });

        twing.addGlobal('global', 'global');

        // data
        let data = integrationTest.getData();

        let expected = integrationTest.getExpected();
        let expectedErrorMessage = integrationTest.getExpectedErrorMessage();

        if (!expectedErrorMessage) {
            try {
                let actual = await twing.render('index.twig', data);

                test.same(actual.trim(), expected.trim(), testMessage);
            }
            catch (e) {
                console.warn(e);

                test.fail(`${testMessage} (${e})`);
            }
        }
        else {
            try {
                await twing.render('index.twig', data);

                test.fail('should throw an error');
            }
            catch (e) {
                test.same(e.toString(), expectedErrorMessage, testMessage);
            }
        }
    }

    test.end();
});


