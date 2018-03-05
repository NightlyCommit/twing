const TwingTemplate = require('../../lib/twing/template').TwingTemplate;
const sinon = require('sinon');

module.exports = class extends TwingTemplate {
    constructor(env) {
        super(env);
    }

    getTemplateName() {
        return 'foo.html.twig';
    }
};