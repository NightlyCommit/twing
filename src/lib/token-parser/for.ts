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
import {TwingToken, TwingTokenType} from "../token";
import {TwingNodeExpressionGetAttr} from "../node/expression/get-attr";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingTokenStream} from "../token-stream";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeFor} from "../node/for";

export class TwingTokenParserFor extends TwingTokenParser {
    parse(token: TwingToken) {
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let stream = this.parser.getStream();
        let targets = this.parser.parseAssignmentExpression();

        stream.expect(TwingTokenType.OPERATOR, 'in');

        let seq = this.parser.parseExpression();

        let ifexpr = null;

        if (stream.nextIf(TwingTokenType.NAME, 'if')) {
            ifexpr = this.parser.parseExpression();
        }

        stream.expect(TwingTokenType.BLOCK_END);

        let body = this.parser.subparse([this, this.decideForFork]);
        let elseToken;

        if (stream.next().getContent() == 'else') {
            stream.expect(TwingTokenType.BLOCK_END);
            elseToken = this.parser.subparse([this, this.decideForEnd], true);
        } else {
            elseToken = null;
        }

        stream.expect(TwingTokenType.BLOCK_END);

        let keyTarget;
        let valueTarget;

        if ((targets.getNodes().size) > 1) {
            keyTarget = targets.getNode(0);
            keyTarget = new TwingNodeExpressionAssignName(keyTarget.getAttribute('name'), keyTarget.getTemplateLine(), keyTarget.getTemplateColumn());

            valueTarget = targets.getNode(1);
            valueTarget = new TwingNodeExpressionAssignName(valueTarget.getAttribute('name'), valueTarget.getTemplateLine(), valueTarget.getTemplateColumn());
        } else {
            keyTarget = new TwingNodeExpressionAssignName('_key', lineno, columnno);

            valueTarget = targets.getNode(0);
            valueTarget = new TwingNodeExpressionAssignName(valueTarget.getAttribute('name'), valueTarget.getTemplateLine(), valueTarget.getTemplateColumn());
        }

        if (ifexpr) {
            this.checkLoopUsageCondition(stream, ifexpr);
            this.checkLoopUsageBody(stream, body);
        }

        return new TwingNodeFor(keyTarget, valueTarget, seq, ifexpr, body, elseToken, lineno, columnno, this.getTag());
    }

    decideForFork(token: TwingToken) {
        return token.test(TwingTokenType.NAME, ['else', 'endfor']);
    }

    decideForEnd(token: TwingToken) {
        return token.test(TwingTokenType.NAME, 'endfor');
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
