import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingExtensionSandbox from "../extension/sandbox";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeSandbox extends TwingNode {
    constructor(body: TwingNode, lineno: number, tag: string = null) {
        super(new TwingMap([['body', body]]), new TwingMap(), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let sandbox = compiler.getEnvironment().getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;
        let handler = compiler.subcompile(this.getNode('body'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) => {
            let alreadySandboxed = sandbox.isSandboxed();

            if (!alreadySandboxed) {
                sandbox.enableSandbox();
            }

            let output = handler(template, context, blocks);

            if (!alreadySandboxed) {
                sandbox.disableSandbox();
            }

            return output;
        }
    }

    // render(context: any, template: TwingTemplate, blocks: TwingMap<string, Array<any>> = new TwingMap()): any {
    //     let sandbox = template.getEnvironment().getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;
    //
    //     let alreadySandboxed = sandbox.isSandboxed();
    //
    //     if (!alreadySandboxed) {
    //         sandbox.enableSandbox();
    //     }
    //
    //     let output = this.getNode('body').render(context, template, blocks);
    //
    //     if (!alreadySandboxed) {
    //         sandbox.disableSandbox();
    //     }
    //
    //     return output;
    // }
}

export default TwingNodeSandbox;