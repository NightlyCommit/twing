import TwingNodeExpressionName from "./name";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";
import TwingTemplate from "../../template";

class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let name = this.getAttribute('name');

        return (template: TwingTemplate, context: any) => {
            return new Proxy({}, {
                set(target, property, value) {
                    if (property === 'value') {
                        context[name] = value;

                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
        }
    }
}

export default TwingNodeExpressionAssignName;