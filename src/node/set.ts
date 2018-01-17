import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingMarkup from "../markup";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeSet extends TwingNode {
    constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('names', names);
        nodes.set('values', values);

        let attributes = new TwingMap();

        attributes.set('capture', capture);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.CAPTURE;

        if (this.getAttribute('capture')) {
            this.setAttribute('safe', true);
        }
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let namesNode = this.getNode('names');
        let valuesNode = this.getNode('values');

        let handlers: Array<any> = [];

        if (!this.getAttribute('capture')) {
            let names = [...namesNode.getNodes().values()];
            let values = [...valuesNode.getNodes().values()];

            let i: number;
            let count: number = names.length;

            for (i = 0; i < count; i++) {
                let name = names[i];
                let value = values[i];

                handlers.push({
                    name: compiler.subcompile(name),
                    value: compiler.subcompile(value)
                });
            }
        }
        else {
            for (let [k, nameNode] of namesNode.getNodes()) {
                handlers.push({
                    name: compiler.subcompile(nameNode),
                    value: compiler.subcompile(valuesNode)
                });
            }
        }

        return (template: TwingTemplate, context: any, blocks: any) => {
            for (let handler of handlers) {
                let nameHandler = handler.name;
                let valueHandler = handler.value;

                let value = valueHandler(template, context, blocks);

                if (this.getAttribute('capture')) {
                    value = value ? new TwingMarkup(value, compiler.getEnvironment().getCharset()) : '';
                }

                nameHandler(template, context, blocks).value = value;
            }
        }
    }
}

export default TwingNodeSet;