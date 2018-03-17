const Twing = require('twing/lib/runtime');

module.exports = {};


/* index.html.twig */
module.exports.__TwingTemplate_0ce3bd6d4cabd98284facc6f779117d5ae7cfb1931912e085b24baa1bf156624 = class __TwingTemplate_0ce3bd6d4cabd98284facc6f779117d5ae7cfb1931912e085b24baa1bf156624 extends Twing.TwingTemplate {
    constructor(env) {
        super(env);

        // line 1
        this.parent = this.loadTemplate("base.html.twig", "index.html.twig", 1);
        this.blocks = new Twing.TwingMap([
            ['content', [this, 'block_content']]
        ]);
    }

    doGetParent(context) {
        return "base.html.twig";
    }

    doDisplay(context, blocks = new Twing.TwingMap()) {
         this.parent.display(context, this.blocks.merge(blocks));
    }

    // line 3
    async block_content(context, blocks = new Twing.TwingMap()) {
        // line 4
        Twing.echo("    Some content block is here.\n\n    ");
        // line 6
        context.set('_parent', context.clone());
        context.set('_seq',  Twing.twingEnsureTraversable((context.has("data") ? context.get("data") : null)));
        Twing.each.bind(this)(context.get('_seq'), (__key__, __value__) => {
            Twing.getContextProxy(context)["_key"] = __key__;
            Twing.getContextProxy(context)["row"] = __value__;
            // line 7
            Twing.echo("        ");
            Twing.echo(this.env.getFilter('escape').getCallable()(...[this.env, context.get("row"), "html", null, true]));
            Twing.echo("\n    ");
        });
        (() => {
            let parent = context.get('_parent');
            context.delete('_seq');
            context.delete('_iterated');
            context.delete('_key');
            context.delete('row');
            context.delete('_parent');
            context.delete('loop');
            for (let [k, v] of parent) {
                if (!context.has(k)) {
                    context.set(k, v);
                }
            }
        })();
    }

    getTemplateName() {
        return "index.html.twig";
    }

    isTraitable() {
        return false;
    }

    getDebugInfo() {
        return new Map([[37,7], [31,6], [29,4], [27,3], [12,1]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(``, "index.html.twig", "/home/ericmorand/Projects/twing/benchmark/templates/index.html.twig");
    }
};

