const {TwingTemplate} = require('../../dist/lib/template');
const TwingEnvironmentMock = require('./environment');

module.exports = class extends TwingTemplate {
    constructor(env) {
        if (!env) {
            env = new TwingEnvironmentMock();
        }

        super(env);
    }

    getTemplateName() {
        return 'foo.html.twig';
    }
};