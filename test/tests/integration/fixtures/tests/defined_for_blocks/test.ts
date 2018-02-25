import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

/**
 * Note that the expected result from the original TwigPHP test is incorrect - but for some reason, the test passes successfully on TwigPHP.
 * @see * https://twigfiddle.com/22p2t1
 */
export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"defined" support for blocks';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent', require('./parent.twig'));
        templates.set('embed', require('./embed.twig'));
        templates.set('blocks', require('./blocks.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};