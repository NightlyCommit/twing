var fs = require('fs');
var path = require('path');
var Twig = Twig || requireUncached("../twig"),
    twig = twig || Twig.twig;

describe("Twig.js Tokenizer ->", function () {
    this.timeout(15000);

    it("should support spaceless", function (done) {
        var file = path.resolve('test/templates/tokenizer/tokenize.twig');
        var template = fs.readFileSync(path.resolve('test/templates/tokenizer/tokenize.twig'));

        var tokens = [];

        Twig.extend(function (Twig) {
            tokens = Twig.tokenize(template.toString());

            // console.log(tokens);
        });

        twig({
            path: file,
            sourceMap: true,
            async: true,
            load: function (template) {
                var r = template.render({
                    foo: {
                        bar: 'bar'
                    },
                    bar: 'BAR'
                });

                console.log(r.markup);

                done();
            }
        });


        // tokens.should.eql([
        //     {
        //         type: 'output',
        //         value: 'foo',
        //         position: {
        //             line: 0,
        //             column: 2
        //         }
        //     },
        //     {
        //         type: 'raw',
        //         value: 'foo bar',
        //         position: {
        //             line: 0,
        //             column: 9
        //         }
        //     },
        //     {
        //         type: 'output',
        //         value: 'bar',
        //         position: {
        //             line: 0,
        //             column: 18
        //         }
        //     },
        //     {
        //         type: 'raw',
        //         value: '\nfoo-bar\n',
        //         position: {
        //             line: 0,
        //             column: 25
        //         }
        //     },
        //     {
        //         type: 'output',
        //         value: 'foo.bar',
        //         position: {
        //             line: 2,
        //             column: 2
        //         }
        //     },
        //     {
        //         type: 'raw',
        //         value: '\n\nEOF\n',
        //         position: {
        //             line: 2,
        //             column: 13
        //         }
        //     }
        // ]);

    });
});