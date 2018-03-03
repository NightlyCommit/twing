const TwingEnvironment = require('../lib/twing/environment').TwingEnvironment;

module.exports = class extends TwingEnvironment {
    constructor(loader, options = {}) {
        super(loader, options);
    }

    getTemplateClass(name, index = null) {
        return '__TwingTemplate_foo';
    }
};
