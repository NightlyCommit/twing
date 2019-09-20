const {TwingEnvironmentNode: TwingEnvironment} = require('../../build/lib/environment/node');

module.exports = class extends TwingEnvironment {
    getTemplateHash(name, index = null, from = null) {
        return `__TwingTemplate_foo${(index === null ? '' : '_' + index)}`;
    }
};
