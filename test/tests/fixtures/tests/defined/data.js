const TwingTestFoo = require('../../foo');

module.exports = {
    definedVar: 'defined',
    zeroVar: 0,
    nullVar: null,
    nested: {
        definedVar: 'defined',
        zeroVar: 0,
        nullVar: null,
        definedArray: [0],
    },
    object: new TwingTestFoo()
};