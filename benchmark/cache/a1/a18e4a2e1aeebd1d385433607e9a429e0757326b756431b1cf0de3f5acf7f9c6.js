const Twing = require('twing/lib/runtime');

module.exports = {};


/* base.html.twig */
module.exports.__TwingTemplate_af66e23ee7c4bc27b263919a4824414dcf79b257562c73fc9c23da4f6129f37b = class __TwingTemplate_af66e23ee7c4bc27b263919a4824414dcf79b257562c73fc9c23da4f6129f37b extends Twing.TwingTemplate {
    constructor(env) {
        super(env);

        this.parent = false;

        this.blocks = new Twing.TwingMap([
            ['htmlbody', [this, 'block_htmlbody']],
            ['header', [this, 'block_header']],
            ['content', [this, 'block_content']]
        ]);
    }

    async doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 1
        Twing.echo("<!DOCTYPE html>\n<html class=\"");
        // line 2
        await this.displayBlock('htmlbody', context, blocks);
        Twing.echo("\">\n<head>\n    <title>Some title</title>\n\n    <style>\n        a {\n            background-color: red;\n        }\n\n        table {\n            color: orange;\n        }\n    </style>\n\n    <script>\n        const foo = function () {\n            global = 'foo';\n        };\n    </script>\n\n    ");
        // line 22
        await this.displayBlock('header', context, blocks);
        // line 24
        Twing.echo("</head>\n<body>\n");
        // line 26
        await this.displayBlock('content', context, blocks);
        // line 29
        Twing.echo("</body>\n</html>");
    }

    // line 2
    async block_htmlbody(context, blocks = new Twing.TwingMap()) {
        Twing.echo("some-body-tag");
    }

    // line 22
    async block_header(context, blocks = new Twing.TwingMap()) {
        // line 23
        Twing.echo("    ");
    }

    // line 26
    async block_content(context, blocks = new Twing.TwingMap()) {
        // line 27
        Twing.echo("    <h1>Overall Title</h1>\n");
    }

    getTemplateName() {
        return "base.html.twig";
    }

    getDebugInfo() {
        return new Map([[50,27], [48,26], [44,23], [42,22], [37,2], [33,29], [31,26], [29,24], [27,22], [24,2], [22,1]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(``, "base.html.twig", "/home/ericmorand/Projects/twing/benchmark/templates/base.html.twig");
    }
};

