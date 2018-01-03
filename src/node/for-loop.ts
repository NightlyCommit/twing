import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeForLoop extends TwingNode {
    constructor(lineno: number, tag: string = null) {
        let attributes = new TwingMap();

        attributes.set('with_loop', false);
        attributes.set('ifexpr', false);
        attributes.set('else', false);

        super(new TwingMap(), attributes, lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        if (this.getAttribute('else')) {
            context['_iterated'] = true;
        }

        if (this.getAttribute('with_loop')) {
            context['loop']['index0']++;
            context['loop']['index']++;
            context['loop']['first'] = false;

            if (!this.getAttribute('ifexpr')) {
                context['loop']['revindex0']--;
                context['loop']['revindex']--;
                context['loop']['last'] = (context['loop']['revindex0'] === 0);
            }
        }

        return '';
    }
}

export = TwingNodeForLoop;