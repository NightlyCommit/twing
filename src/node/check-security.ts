import TwingNode from "../node";
import TwingMap from "../map";
import TwingCompiler from "../compiler";

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

    compile(compiler: TwingCompiler) {
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

        compiler
            .write('let tags = ').repr(tags).raw(";\n")
            .write('let filters = ').repr(filters).raw(";\n")
            .write('let functions = ').repr(functions).raw(";\n\n")
            .write("try {\n")
            .indent()
            .write("this.env.getExtension('TwingExtensionSandbox').checkSecurity(\n")
            .indent()
            .write(!tags.size ? "[],\n" : "['" + [...tags.keys()].join(', ') + "'],\n")
            .write(!filters.size ? "[],\n" : "['" + [...filters.keys()].join(', ') + "'],\n")
            .write(!functions.size ? "[]\n" : "['" + [...functions.keys()].join(', ') + "']\n")
            .outdent()
            .write(");\n")
            .outdent()
            .write("}\n")
            .write("catch (e) {\n")
            .indent()
            .write("if (e instanceof Twing.TwingSandboxSecurityError) {\n")
            .indent()
            .write("e.setSourceContext(this.getSourceContext());\n\n")
            .write("if (e instanceof Twing.TwingSandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {\n")
            .indent()
            .write("e.setTemplateLine(tags.get(e.getTagName()));\n")
            .outdent()
            .write("}\n")
            .write("else if (e instanceof Twing.TwingSandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {\n")
            .indent()
            .write("e.setTemplateLine(filters.get(e.getFilterName()));\n")
            .outdent()
            .write("}\n")
            .write("else if (e instanceof Twing.TwingSandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {\n")
            .indent()
            .write("e.setTemplateLine(functions.get(e.getFunctionName()));\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write('}\n\n')
            .write("throw e;\n")
            .outdent()
            .write("}\n\n")
        ;
    }
}

export default TwingNodeCheckSecurity;