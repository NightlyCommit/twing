import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports literals';
    }

    getTemplates() {
        return {
            'index.twig': `
1 {{ true }}
2 {{ TRUE }}
3 {{ false }}
4 {{ FALSE }}
5 {{ none }}
6 {{ NONE }}
7 {{ null }}
8 {{ NULL }}`
        };
    }

    getExpected() {
        return `
1 1
2 1
3 
4 
5 
6 
7 
8 
`;
    }
}
