const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingTemplate} = require('../../../../../../build/template');
const {TwingOutputBuffering} = require('../../../../../../build/output-buffering');

class CustomTemplate extends TwingTemplate {
    display(context, blocks) {
        TwingOutputBuffering.echo('<!-- CUSTOM HEADER -->\n');

        super.display(context, blocks);

        TwingOutputBuffering.echo('\n<!-- CUSTOM FOOTER -->');
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'runtime with custom template class';
    }

    setTwing(env) {
        let runtime = env.getTemplateRuntime();

        runtime.CustomTemplate = CustomTemplate;

        env.setTemplateRuntime(runtime);

        super.setTwing(env);
    }

    getConfig() {
        return {
            base_template_class: 'CustomTemplate'
        }
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
