const {TwingParser, TwingEnvironment, TwingLoaderNull} = require("../../build/main");

const sinon = require('sinon');

class Parser extends TwingParser {
    constructor() {
        super(new TwingEnvironment(new TwingLoaderNull()));
    }

    parseExpression(precedence, allowArrow) {
    }

    parseAssignmentExpression() {
    }

    parseMultitargetExpression() {
    }
}

module.exports.getParser = function (stream) {
    let parser = new Parser();

    Reflect.set(parser, 'stream', stream);
    Reflect.set(parser, 'handlers', new Map());

    sinon.stub(parser, 'hasBlock').returns(false);
    sinon.stub(parser, 'setBlock').returns(false);
    sinon.stub(parser, 'pushLocalScope').returns(false);
    sinon.stub(parser, 'pushBlockStack').returns(false);

    return parser;
};