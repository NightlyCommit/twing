import TwingTemplate from "../template";
import TwingMap from "../map";
import TwingEnvironment from "../environment";
import DoDisplayHandler from "../do-display-handler";

class TwingTemplateImpl extends TwingTemplate {
    getTemplateName(): string {
        throw new Error('getTemplateName not implemented');
    }

    getDebugInfo(): Array<any>{
        return [];
    }

    doDisplay(context: any, blocks?: TwingMap<string, Array<any>>): string {
        throw new Error('doDisplay not implemented');
    }

    constructor(env: TwingEnvironment, doConstruct: DoDisplayHandler = null) {
        super(env);

        if (doConstruct !== null) {
            doConstruct(this);
        }
    }
}

export default TwingTemplateImpl;