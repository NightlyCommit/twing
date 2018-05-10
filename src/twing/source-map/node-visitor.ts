import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";
import {TwingSourceMapNodePrint} from "./node/print";
import {TwingSourceMapNodeText} from "./node/text";
import {TwingSourceMapNode} from "./node";
import {TwingNodeBody} from "../node/body";
import {TwingSourceMapNode2} from "./node-2";

export class TwingSourceMapNodeVisitor extends TwingBaseNodeVisitor {
    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        // if (node.getType() !== null && node.getType() !== TwingNodeType.MODULE && node.getType() !== TwingNodeType.BODY) {
        //     let bodyNodes = new Map([
        //         [0, new TwingSourceMapNode(node)],
        //         [1, node],
        //         [2, new TwingSourceMapNode2(node)]
        //     ]);
        //
        //     return new TwingNodeBody(bodyNodes);
        // }

        return node;
    }

    getPriority(): number {
        return 0;
    }
}
