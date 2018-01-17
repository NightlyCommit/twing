import TwingNodePrint from "./print";
import TwingTemplate from "../template";
import TwingMap from "../map";
import TwingExtensionSandbox from "../extension/sandbox";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeSandboxedPrint extends TwingNodePrint {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let extension = compiler.getEnvironment().getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;
        let printHandler: DoDisplayHandler = super.compile(compiler);

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return extension.ensureToStringAllowed(printHandler(template, context, blocks));
        }
    }
}

export default TwingNodeSandboxedPrint;