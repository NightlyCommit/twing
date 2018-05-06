import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";
import {TwingSourceMapNodePrint} from "./node/print";
import {TwingSourceMapNodeText} from "./node/text";
import {TwingSourceMapNode} from "./node";
import {TwingNodeBody} from "../node/body";

export class TwingSourceMapNodeVisitor extends TwingBaseNodeVisitor {
    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.PRINT || node.getType() === TwingNodeType.TEXT) {
            let bodyNodes = new Map([
                [0, new TwingSourceMapNode(node)],
                [1, node]
            ]);

            return new TwingNodeBody(bodyNodes);
        }

        return node;
    }

    getPriority(): number {
        return 0;
    }
}
