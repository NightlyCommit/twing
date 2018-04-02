/**
 * Loops over each item of a sequence.
 *
 * <pre>
 * <ul>
 *  {% for user in users %}
 *    <li>{{ user.username|e }}</li>
 *  {% endfor %}
 * </ul>
 * </pre>
 */
import {TwingTokenParser} from "../token-parser";
import {TwingNode, TwingNodeType} from "../node";
import {TwingToken} from "../token";
import {TwingNodeExpressionGetAttr} from "../node/expression/get-attr";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingTokenStream} from "../token-stream";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeFor} from "../node/for";

export class TwingTokenParserFor extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let targets = this.parser.getExpressionParser().parseAssignmentExpression();

        stream.expect(TwingToken.OPERATOR_TYPE, 'in');

        let seq = this.parser.getExpressionParser().parseExpression();

        let ifexpr = null;

        if (stream.nextIf(TwingToken.NAME_TYPE, 'if')) {
            ifexpr = this.parser.getExpressionParser().parseExpression();
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let body = this.parser.subparse([this, this.decideForFork]);
        let elseToken;

        if (stream.next().getValue() == 'else') {
            stream.expect(TwingToken.BLOCK_END_TYPE);
            elseToken = this.parser.subparse([this, this.decideForEnd], true);
        } else {
            elseToken = null;
        }

        stream.expect(TwingToken.BLOCK_END_TYPE);

        let keyTarget;
        let valueTarget;

        if ((targets.getNodes().size) > 1) {
            keyTarget = targets.getNode(0);
            keyTarget = new TwingNodeExpressionAssignName(keyTarget.getAttribute('name'), keyTarget.getTemplateLine());

            valueTarget = targets.getNode(1);
            valueTarget = new TwingNodeExpressionAssignName(valueTarget.getAttribute('name'), valueTarget.getTemplateLine());
        } else {
            keyTarget = new TwingNodeExpressionAssignName('_key', lineno);

            valueTarget = targets.getNode(0);
            valueTarget = new TwingNodeExpressionAssignName(valueTarget.getAttribute('name'), valueTarget.getTemplateLine());
        }

        if (ifexpr) {
            this.checkLoopUsageCondition(stream, ifexpr);
            this.checkLoopUsageBody(stream, body);
        }

        return new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, elseToken, lineno, this.getTag());
    }

    decideForFork(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, ['else', 'endfor']);
    }

    decideForEnd(token: TwingToken) {
        return token.test(TwingToken.NAME_TYPE, 'endfor');
    }

    // the loop variable cannot be used in the condition
    checkLoopUsageCondition(stream: TwingTokenStream, node: TwingNode) {
        let self = this;

        if ((node.constructor.name === 'TwingNodeExpressionGetAttr') && (node.getNode('node').constructor.name === 'TwingNodeExpressionName') && (node.getNode('node').getAttribute('name') === 'loop')) {
            throw new TwingErrorSyntax('The "loop" variable cannot be used in a looping condition.', node.getTemplateLine(), stream.getSourceContext());
        }

        node.getNodes().forEach(function (n) {
            self.checkLoopUsageCondition(stream, n);
        });
    }

    // check usage of non-defined loop-items

    getTag() {
        return 'for';
    }

    // it does not catch all problems (for instance when a for is included into another or when the variable is used in an include)
    private checkLoopUsageBody(stream: TwingTokenStream, node: TwingNode) {
        if ((node.constructor.name === 'TwingNodeExpressionGetAttr') && (node.getNode('node').constructor.name === 'TwingNodeExpressionName') && (node.getNode('node').getAttribute('name') === 'loop')) {
            let attribute = node.getNode('attribute');

            if ((attribute.constructor.name === 'TwingNodeExpressionConstant') && (['length', 'revindex0', 'revindex', 'last'].indexOf(attribute.getAttribute('value')) > -1)) {
                throw new TwingErrorSyntax(`The "loop.${attribute.getAttribute('value')}" variable is not defined when looping with a condition.`, node.getTemplateLine(), stream.getSourceContext());
            }
        }

        // should check for parent.loop.XXX usage
        if (node.getType() === TwingNodeType.FOR) {
            return;
        }

        for (let [k, n] of node.getNodes()) {
            this.checkLoopUsageBody(stream, n);
        }
    }
}
