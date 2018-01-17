import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingExtensionSandbox from "../extension/sandbox";
import TwingSandboxSecurityNotAllowedTagError from "../sandbox/security-not-allowed-tag-error";
import TwingSandboxSecurityNotAllowedFilterError from "../sandbox/security-not-allowed-filter-error";
import TwingSandboxSecurityNotAllowedFunctionError from "../sandbox/security-not-allowed-function-error";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeCheckSecurity extends TwingNode {
    private usedFilters: TwingMap<string, TwingNode>;
    private usedTags: TwingMap<string, TwingNode>;
    private usedFunctions: TwingMap<string, TwingNode>;

    constructor(usedFilters: TwingMap<string, TwingNode>, usedTags: TwingMap<string, TwingNode>, usedFunctions: TwingMap<string, TwingNode>) {
        super();

        this.usedFilters = usedFilters;
        this.usedTags = usedTags;
        this.usedFunctions = usedFunctions;
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let tags = new TwingMap();

        this.usedTags.forEach(function (node, name) {
            if (node instanceof TwingNode) {
                tags.set(name, node.getTemplateLine());
            }
            else {
                tags.set(node, null);
            }
        });

        let filters = new TwingMap();

        this.usedFilters.forEach(function (node, name) {
            if (node instanceof TwingNode) {
                filters.set(name, node.getTemplateLine());
            }
            else {
                filters.set(node, null);
            }
        });

        let functions = new TwingMap();

        this.usedFunctions.forEach(function (node, name) {
            if (node instanceof TwingNode) {
                functions.set(name, node.getTemplateLine());
            }
            else {
                functions.set(node, null);
            }
        });

        let extension = compiler.getEnvironment().getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;

        try {
            extension.checkSecurity(
                [...tags.keys()],
                [...filters.keys()],
                [...functions.keys()]
            );
        }
        catch (e) {
            if (e instanceof TwingSandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {
                e.setTemplateLine(tags.get(e.getTagName()));
            }
            else if (e instanceof TwingSandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {
                e.setTemplateLine(filters.get(e.getFilterName()));
            }
            else if (e instanceof TwingSandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {
                e.setTemplateLine(functions.get(e.getFunctionName()));
            }

            throw e;
        }

        return () => {

        };
    }
}

export default TwingNodeCheckSecurity;