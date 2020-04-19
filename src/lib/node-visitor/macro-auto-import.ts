import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";
import {TwingNodeImport} from "../node/import";
import {TwingNodeExpressionName} from "../node/expression/name";
import {TwingNodeExpressionAssignName} from "../node/expression/assign-name";
import {TwingNodeExpressionMethodCall} from "../node/expression/method-call";
import {TwingNodeExpressionArray} from "../node/expression/array";

export class TwingNodeVisitorMacroAutoImport extends TwingBaseNodeVisitor {
    private hasMacroCalls: boolean = false;

    public doEnterNode(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() == TwingNodeType.MODULE) {
            this.hasMacroCalls = false;
        }

        return node;
    }

    public doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() == TwingNodeType.MODULE) {
            if (this.hasMacroCalls) {
                node.getNode('constructor_end').setNode('_auto_macro_import', new TwingNodeImport(new TwingNodeExpressionName('_self', 0, 0), new TwingNodeExpressionAssignName('_self', 0, 0), 0, 0, 'import', true));
            }
        } else {
            if ((node.getType() == TwingNodeType.EXPRESSION_GET_ATTR) && (node.getNode('node').getType() === TwingNodeType.EXPRESSION_NAME) && (node.getNode('node').getAttribute('name') === '_self') && (node.getNode('attribute').getType() === TwingNodeType.EXPRESSION_CONSTANT)) {
                this.hasMacroCalls = true;

                let name = node.getNode('attribute').getAttribute('value');

                node = new TwingNodeExpressionMethodCall(node.getNode('node'), name, node.getNode('arguments') as TwingNodeExpressionArray, node.getTemplateLine(), node.getTemplateColumn());
                node.setAttribute('safe', true);
            }
        }

        return node;
    }

    public getPriority() {
        // we must run before auto-escaping
        return -10;
    }
}
