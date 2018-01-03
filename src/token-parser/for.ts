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
import TwingTokenParser from "../token-parser";
import TwingNode from "../node";
import TwingToken from "../token";
import TwingTokenType from "../token-type";
import TwingNodeExpressionName from "../node/expression/name";
import TwingNodeExpressionGetAttr from "../node/expression/get-attr";
import TwingErrorSyntax from "../error/syntax";
import TwingTokenStream from "../token-stream";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionAssignName from "../node/expression/assign-name";
import TwingNodeFor from "../node/for";

class TwingTokenParserFor extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let stream = this.parser.getStream();
        let targets = this.parser.getExpressionParser().parseAssignmentExpression();

        stream.expect(TwingTokenType.OPERATOR_TYPE, 'in');

        let seq = this.parser.getExpressionParser().parseExpression();

        let ifexpr = null;

        if (stream.nextIf(TwingTokenType.NAME_TYPE, 'if')) {
            ifexpr = this.parser.getExpressionParser().parseExpression();
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let body = this.parser.subparse(this.decideForFork);
        let elseToken;

        if (stream.next().getValue() == 'else') {
            stream.expect(TwingTokenType.BLOCK_END_TYPE);
            elseToken = this.parser.subparse(this.decideForEnd, true);
        } else {
            elseToken = null;
        }

        stream.expect(TwingTokenType.BLOCK_END_TYPE);

        let keyTarget;
        let valueTarget;

        if ((targets.getNodes().length()) > 1) {
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
        return token.test(TwingTokenType.NAME_TYPE, ['else', 'endfor']);
    }

    decideForEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME_TYPE, 'endfor');
    }

    // the loop variable cannot be used in the condition
    checkLoopUsageCondition(stream: TwingTokenStream, node: TwingNode) {
        let self = this;

        if ((node.constructor.name === 'TwingNodeExpressionGetAttr') && (node.getNode('node').constructor.name === 'TwingNodeExpressionName') && (node.getNode('node').getAttribute('name') === 'loop')) {
            throw new TwingErrorSyntax('The "loop" variable cannot be used in a looping condition.', node.getTemplateLine(), stream.getSourceContext());
        }

        node.getNodes().forEach(function (n) {
            if (n) {
                self.checkLoopUsageCondition(stream, n);
            }
        });
    }

    // check usage of non-defined loop-items
    // it does not catch all problems (for instance when a for is included into another or when the variable is used in an include)
    private checkLoopUsageBody(stream: TwingTokenStream, node: TwingNode) {
        let self = this;

        if ((node.constructor.name === 'TwingNodeExpressionGetAttr') && (node.getNode('node').constructor.name === 'TwingNodeExpressionName') && (node.getNode('node').getAttribute('name') === 'loop')) {
            let attribute = node.getNode('attribute');

            if ((attribute.constructor.name === 'TwingNodeExpressionConstant') && (['length', 'revindex0', 'revindex', 'last'].indexOf(attribute.getAttribute('value')) > -1)) {
                throw new TwingErrorSyntax(`The "loop.${attribute.getAttribute('value')}" variable is not defined when looping with a condition.`, node.getTemplateLine(), stream.getSourceContext());
            }
        }

        // should check for parent.loop.XXX usage
        if (node.constructor.name === 'TwingNodeFor') {
            return;
        }

        node.getNodes().forEach(function (n) {
            if (n) {
                self.checkLoopUsageBody(stream, n);
            }
        });
    }

    getTag() {
        return 'for';
    }
}

export default TwingTokenParserFor;