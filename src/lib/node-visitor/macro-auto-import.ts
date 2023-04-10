import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode} from "../node";
import {TwingEnvironment} from "../environment";
import {type as nameType} from "../node/expression/name";
import {TwingNodeExpressionMethodCall} from "../node/expression/method-call";
import {TwingNodeExpressionArray} from "../node/expression/array";
import {type as getAttrType} from "../node/expression/get-attribute";
import {type as constantType} from "../node/expression/constant";

export class TwingNodeVisitorMacroAutoImport extends TwingBaseNodeVisitor {
    public doEnterNode(node: TwingNode, env: TwingEnvironment) {
        return node;
    }

    public doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if ((node.type == getAttrType) && (node.getNode('node').is(nameType)) && (node.getNode('node').getAttribute('name') === '_self') && (node.getNode('attribute').is(constantType))) {
            let name = node.getNode('attribute').getAttribute('value');

            node = new TwingNodeExpressionMethodCall(node.getNode('node'), name, node.getNode('arguments') as TwingNodeExpressionArray, node.getTemplateLine(), node.getTemplateColumn());
            node.setAttribute('safe', true);
        }

        return node;
    }

    public getPriority() {
        // we must run before auto-escaping
        return -10;
    }
}
