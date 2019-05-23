const {TwingEnvironmentNode: TwingEnvironment} = require('../../build/environment/node');

module.exports = class extends TwingEnvironment {
    getTemplateClass(name, index = null) {
        return `__TwingTemplate_foo${(index === null ? '' : '_' + index)}`;
    }
};
