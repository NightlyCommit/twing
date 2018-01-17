import TwingBaseNodeVisitor from "../../base-node-visitor";
import TwingNode from "../../node";
import TwingEnvironment from "../../environment";
import TwingNodeModule from "../../node/module";
import TwingNodeBlock from "../../node/block";
import TwingNodeMacro from "../../node/macro";
import TwingMap from "../../map";
import TwingProfilerProfile from "../profile";
import TwingNodeBody from "../../node/body";
import TwingProfilerNodeEnterProfile from "../node/enter-profile";
import TwingProfilerNodeLeaveProfile from "../node/leave-profile";

let md5 = require('locutus/php/strings/md5');
let uniqid = require('locutus/php/misc/uniqid');
let mt_rand = require('locutus/php/math/mt_rand');

class TwingProfilerNodeVisitorProfiler extends TwingBaseNodeVisitor {
    private extensionName: string;

    constructor(extensionName: string) {
        super();

        this.extensionName = extensionName;
    }

    doEnterNode(node: TwingNode, env: TwingEnvironment) {
        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if (node as any instanceof TwingNodeModule) {
            let varName = this.getVarName();

            let displayStartNodes = new TwingMap();

            displayStartNodes.push(new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.TEMPLATE, node.getTemplateName(), varName));
            displayStartNodes.push(node.getNode('display_start'));

            node.setNode('display_start', new TwingNode(displayStartNodes));

            let displayEndNodes = new TwingMap();

            displayEndNodes.push(new TwingProfilerNodeLeaveProfile(varName));
            displayEndNodes.push(node.getNode('display_end'));

            node.setNode('display_end', new TwingNode(displayEndNodes));
        }
        else if (node as any instanceof TwingNodeBlock) {
            let varName = this.getVarName();

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.BLOCK, node.getAttribute('name'), varName));
            bodyNodes.push(node.getNode('body'));
            bodyNodes.push(new TwingProfilerNodeLeaveProfile(varName));

            node.setNode('body', new TwingNodeBody(bodyNodes));
        }
        else if (node as any instanceof TwingNodeMacro) {
            let varName = this.getVarName();

            let bodyNodes = new TwingMap();

            bodyNodes.push(new TwingProfilerNodeEnterProfile(this.extensionName, TwingProfilerProfile.MACRO, node.getAttribute('name'), varName));
            bodyNodes.push(node.getNode('body'));
            bodyNodes.push(new TwingProfilerNodeLeaveProfile(varName));

            node.setNode('body', new TwingNodeBody(bodyNodes));
        }

        return node;
    }

    getVarName(): string {
        return `__internal_${md5(uniqid(mt_rand(), true))}`;
    }

    getPriority() {
        return 0;
    }
}

export default TwingProfilerNodeVisitorProfiler;