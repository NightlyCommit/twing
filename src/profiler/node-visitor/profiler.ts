import {TwingBaseNodeVisitor} from "../../base-node-visitor";
import {TwingNode, TwingNodeType} from "../../node";
import {TwingEnvironment} from "../../environment";

import {TwingProfilerProfile} from "../profile";
import {TwingNodeBody} from "../../node/body";
import {TwingProfilerNodeEnterProfile} from "../node/enter-profile";
import {TwingProfilerNodeLeaveProfile} from "../node/leave-profile";

const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

export class TwingProfilerNodeVisitorProfiler extends TwingBaseNodeVisitor {
    private extensionName: string;

    constructor(extensionName: string) {
        super();

        this.extensionName = extensionName;
    }

    protected doEnterNode(node: TwingNode, env: TwingEnvironment) {
        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() === TwingNodeType.MODULE) {
            let varName = this.getVarName();

            let displayStartNodes = new Map();
            let i: number = 0;

            displayStartNodes.set(i++, new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.TEMPLATE, node.getTemplateName(), varName));
            displayStartNodes.set(i++, node.getNode('display_start'));

            node.setNode('display_start', new TwingNode(displayStartNodes));

            let displayEndNodes = new Map();

            i = 0;

            displayEndNodes.set(i++, new TwingProfilerNodeLeaveProfile(varName));
            displayEndNodes.set(i++, node.getNode('display_end'));

            node.setNode('display_end', new TwingNode(displayEndNodes));
        }
        else if (node.getType() === TwingNodeType.BLOCK) {
            let varName = this.getVarName();

            let bodyNodes = new Map();
            let i: number = 0;

            bodyNodes.set(i++, new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.BLOCK, node.getAttribute('name'), varName));
            bodyNodes.set(i++, node.getNode('body'));
            bodyNodes.set(i++, new TwingProfilerNodeLeaveProfile(varName));

            node.setNode('body', new TwingNodeBody(bodyNodes));
        }
        else if (node.getType() === TwingNodeType.MACRO) {
            let varName = this.getVarName();

            let bodyNodes = new Map();
            let i: number = 0;

            bodyNodes.set(i++, new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.MACRO, node.getAttribute('name'), varName));
            bodyNodes.set(i++, node.getNode('body'));
            bodyNodes.set(i++, new TwingProfilerNodeLeaveProfile(varName));

            node.setNode('body', new TwingNodeBody(bodyNodes));
        }

        return node;
    }

    private getVarName(): string {
        return `__internal_${hex.stringify(sha256(this.extensionName))}`;
    }

    getPriority() {
        return 0;
    }
}
