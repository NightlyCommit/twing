import {Test} from "tape";
import TwingTestIntegrationTestCase from "../../integration-test-case";

const tap = require('tap');
const tape = require('tape');
const fs = require('fs');
const path = require('path');
const finder = require('fs-finder');
const merge = require('merge');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing', path.resolve('./build/node/twing.js'));

let Twing = require('twing');

let nh = require('node-hook');

nh.hook('.twig', function (source: string, filename: string) {
    return `module.exports = ${JSON.stringify(source)};`;
});

nh.hook('.html', function (source: string, filename: string) {
    return `module.exports = ${JSON.stringify(source)};`;
});

// gather fixtures
// let directory = path.resolve('test/fixtures/tags/embed/error_line');
// let directory = path.resolve('test/tests/integration/fixtures/functions/dump');
let directory = path.resolve('test/tests/integration/fixtures');

let files = finder.from(directory).findFiles('test.ts');

tap.test('integration tests', async function (test: Test) {
    for (let file of files) {
        let dirname = path.dirname(file);

        let IntegrationTest = require(file);
        let integrationTest: TwingTestIntegrationTestCase = new IntegrationTest(path.relative(directory, dirname));
        let testMessage = integrationTest.getName() !== integrationTest.getDescription() ? `${integrationTest.getName()}: ${integrationTest.getDescription()}` : integrationTest.getDescription();

        // templates
        let templates = integrationTest.getTemplates();

        // config
        let config = merge({
            strict_variables: true
        }, integrationTest.getConfig());

        let loader = new Twing.TwingLoaderArray(templates);
        let twing = new Twing.TwingEnvironment(loader, config);

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

                // for (let [k, v] of templates) {
                //     console.warn(twing.compile(twing.parse(twing.tokenize(twing.getLoader().getSourceContext(k)))));
                // }


                test.same(actual.trim(), expected.trim(), testMessage);

                fs.writeFileSync(path.join(dirname, 'actual.html'), actual);
            }
            catch (e) {
                console.warn(e);

                // for (let [k, v] of templates) {
                //     console.warn(twing.compile(twing.parse(twing.tokenize(twing.getLoader().getSourceContext(k)))));
                // }

                test.fail(`${testMessage} (${e})`);
            }
        }
        else {
            try {
                await twing.render('index.twig', data);

                test.fail('should throw an error');
            }
            catch (e) {
                // console.warn(e);

                test.same(e.toString(), expectedErrorMessage, testMessage);
            }
        }
    }

    test.end();
});


