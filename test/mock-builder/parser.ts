import {TwingParser} from "../../src/lib/parser";
import {TwingEnvironmentNode} from "../../src/lib/environment/node";
import {TwingLoaderNull} from "../../src/lib/loader/null";
import {TwingTokenStream} from "../../src/lib/token-stream";
import {TwingNode} from "../../src/lib/node";
import {TwingNodeExpression} from "../../src/lib/node/expression";

const sinon = require('sinon');

class Parser extends TwingParser {
    constructor() {
        super(new TwingEnvironmentNode(new TwingLoaderNull()));
    }

    parseExpression(precedence: number = 0, allowArrow: boolean = false): TwingNodeExpression {
        return null;
    }

    parseAssignmentExpression(): TwingNode {
        return null;
    }

    parseMultitargetExpression(): TwingNode {
        return null;
    }
}

export function getParser(stream: TwingTokenStream): Parser {
    let parser = new Parser();

    Reflect.set(parser, 'stream', stream);
    Reflect.set(parser, 'handlers', new Map());

    sinon.stub(parser, 'hasBlock').returns(false);
    sinon.stub(parser, 'setBlock').returns(false);
    sinon.stub(parser, 'pushLocalScope').returns(false);
    sinon.stub(parser, 'pushBlockStack').returns(false);

    return parser;
}