const TwingParser = require("../../lib/twing/parser").TwingParser;

const sinon = require('sinon');

class Parser extends TwingParser {
    constructor() {
        super(null);
    }
}

class ExpressionParser {
    parseExpression() {
    }

    parseAssignmentExpression() {
    }

    parseMultitargetExpression() {
    }
}

module.exports.getParser = function (stream, expressionParser) {
    let parser = new Parser();

    Reflect.set(parser, 'stream', stream);
    Reflect.set(parser, 'handlers', new Map());

    sinon.stub(parser, 'hasBlock').returns(false);
    sinon.stub(parser, 'setBlock').returns(false);
    sinon.stub(parser, 'pushLocalScope').returns(false);
    sinon.stub(parser, 'pushBlockStack').returns(false);
    sinon.stub(parser, 'getExpressionParser').returns(expressionParser ? expressionParser : new ExpressionParser());

    return parser;
};