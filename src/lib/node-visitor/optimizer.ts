import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode} from "../node";
import {TwingEnvironment} from "../environment";

/**
 * @author Eric MORAND <eric.morand@gmail.com>
 * @deprecated
 */
export class TwingNodeVisitorOptimizer extends TwingBaseNodeVisitor {
    static readonly OPTIMIZE_ALL = -1;
    static readonly OPTIMIZE_NONE = 0;
    static readonly OPTIMIZE_FOR = 2;
    static readonly OPTIMIZE_RAW_FILTER = 4;
    // obsolete, does not do anything
    static readonly OPTIMIZE_VAR_ACCESS = 8;

    protected doEnterNode(node: TwingNode, env: TwingEnvironment) {
        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        return node;
    }

    getPriority() {
        return 255;
    }
}
