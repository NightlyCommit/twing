const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingTemplate} = require('../../../../../../build/template');

class CustomTemplate extends TwingTemplate {
    display(context, blocks) {
        this.echo('<!-- CUSTOM HEADER -->\n');

        super.display(context, blocks);

        this.echo('\n<!-- CUSTOM FOOTER -->');
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'environment with custom template constructor';
    }

    setTwing(env) {
        env.setTemplateConstructor(CustomTemplate);

        super.setTwing(env);
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
