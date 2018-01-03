const TwingTemplate = require('../dist/template');

class TwingTemplate1234 extends TwingTemplate
{
    doDisplay(context, blocks) {
        let self = this;        // line 1
        context[`foo`] = `foo`;
        // line 2
        context[`bar`] = `foo<br />`;
        // line 3
        self.obEcho(`
`);
        // line 4
        self.obEcho((context[`foo`] || null));
        self.obEcho(`
`);
        // line 5
        self.obEcho((context[`bar`] || null));
        self.obEcho(`

`);
        // line 7
        [context[`foo`], context[`bar`]] =         [`foo`, `bar`];
        // line 8
        self.obEcho(`
`);
        // line 9
        self.obEcho((context[`foo`] || null));
        self.obEcho((context[`bar`] || null));
    }

}
module.exports = TwingTemplate1234;