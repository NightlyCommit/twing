const {TwingError} = require('../../../../../dist/cjs/lib/error');

const {
    TwingLoaderArray,
    TwingEnvironment,
    TwingErrorRuntime,
    TwingLoaderFilesystem,
    TwingSource
} = require('../../../../../dist/cjs/main');

const tap = require('tape');
const path = require('path');

class TwingTestsErrorTestFoo {
    bar() {
        throw new Error('Runtime error...');
    }
}

tap.test('TwingError', function (test) {
    test.test('constructor', function (test) {
        let previous = new Error();
        let error = new TwingError('foo', -1, 'bar', previous);

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), -1, 'template line should be set');
        test.same(error.getMessage(), 'foo in "bar"', 'message should be set');

        error = new TwingError('foo');

        test.same(error.getSourceContext(), null);

        test.end();
    });

    test.test('twingExceptionGuessWithMissingVarAndArrayLoader', function (test) {
        let loader = new TwingLoaderArray({
            'base.html': '{% block content %}{% endblock %}',
            'index.html': `{% extends 'base.html' %}
{% block content %}
    {{ foo.bar }}
{% endblock %}
{% block foo %}
    {{ foo.bar }}
{% endblock %}`
        });

        let twing = new TwingEnvironment(loader, {
            strict_variables: true,
            debug: true,
            cache: false
        });

        let template = twing.loadTemplate('index.html');

        try {
            template.render({});

            test.fail();
        }
        catch (e) {
            test.same(e.getMessage(), 'Variable \`foo\` does not exist in "index.html" at line 3.');
            test.same(e.getTemplateLine(), 3);
            test.same(e.getSourceContext().getName(), 'index.html');
            test.true(e instanceof TwingErrorRuntime);
        }

        test.end();
    });

    test.test('twingExceptionGuessWithExceptionAndArrayLoader', function (test) {
        let loader = new TwingLoaderArray({
            'base.html': '{% block content %}{% endblock %}',
            'index.html': `{% extends 'base.html' %}
{% block content %}
    {{ foo.bar }}
{% endblock %}
{% block foo %}
    {{ foo.bar }}
{% endblock %}`
        });

        let twing = new TwingEnvironment(loader, {
            strict_variables: true,
            debug: true,
            cache: false
        });

        let template = twing.loadTemplate('index.html');

        try {
            template.render({
                foo: new TwingTestsErrorTestFoo()
            });

            test.fail();
        }
        catch (e) {
            test.true(e instanceof TwingErrorRuntime);
            test.same(e.getMessage(), 'An exception has been thrown during the rendering of a template ("Runtime error...") in "index.html" at line 3.');
            test.same(e.getTemplateLine(), 3);
            test.same(e.getSourceContext().getName(), 'index.html');
        }

        test.end();
    });

    test.test('twingExceptionGuessWithMissingVarAndFilesystemLoader', function (test) {
        let loader = new TwingLoaderFilesystem(path.resolve('test/tests/integration/fixtures/errors'));

        let twing = new TwingEnvironment(loader, {
            strict_variables: true,
            debug: true,
            cache: false
        });

        let template = twing.loadTemplate('index.html');

        try {
            template.render({});

            test.fail();
        }
        catch (e) {
            test.true(e instanceof TwingErrorRuntime);
            test.same(e.getMessage(), 'Variable \`foo\` does not exist in "index.html" at line 3.');
            test.same(e.getTemplateLine(), 3);
            test.same(e.getSourceContext().getName(), 'index.html');
        }

        test.end();
    });

    test.test('twingExceptionAddsFileAndLine', function (test) {
        let erroredTemplates = [
            {
                templates: {
                    index: '\n\n{{ foo.bar }}\n\n\n{{ \'foo\' }}'
                },
                name: 'index',
                line: 3
            },

            // error occurs in an included template
            {
                templates: {
                    index: '{% include \'partial\' %}',
                    partial: '{{ foo.bar }}'
                },
                name: 'partial',
                line: 1
            },

            // error occurs in a parent block when called via parent()
            {
                templates: {
                    index: `{% extends 'base' %}
                    {% block content %}
                        {{ parent() }}
                    {% endblock %}`,
                    base: '{% block content %}{{ foo.bar }}{% endblock %}'
                },
                name: 'base',
                line: 1
            },

            // error occurs in a block from the child
            {
                templates: {
                    index: `{% extends 'base' %}
                    {% block content %}
                        {{ foo.bar }}
                    {% endblock %}
                    {% block foo %}
                        {{ foo.bar }}
                    {% endblock %}`,
                    base: '{% block content %}{% endblock %}'
                },
                name: 'index',
                line: 3
            }
        ];

        for (let erroredTemplate of erroredTemplates) {
            let loader = new TwingLoaderArray(erroredTemplate.templates);

            let twing = new TwingEnvironment(loader, {
                strict_variables: true,
                debug: true,
                cache: false
            });

            let template = twing.loadTemplate('index');

            try {
                template.render({});

                test.fail();
            }
            catch (e) {
                test.true(e instanceof TwingErrorRuntime);
                test.same(e.getMessage(), `Variable \`foo\` does not exist in "${erroredTemplate.name}" at line ${erroredTemplate.line}.`);
                test.same(e.getTemplateLine(), erroredTemplate.line);
                test.same(e.getSourceContext().getName(), erroredTemplate.name);
            }

            try {
                template.render({
                    foo: new TwingTestsErrorTestFoo()
                });

                test.fail();
            }
            catch (e) {
                test.true(e instanceof TwingErrorRuntime);
                test.same(e.getMessage(), `An exception has been thrown during the rendering of a template ("Runtime error...") in "${erroredTemplate.name}" at line ${erroredTemplate.line}.`);
                test.same(e.getTemplateLine(), erroredTemplate.line);
                test.same(e.getSourceContext().getName(), erroredTemplate.name);
            }
        }

        test.end();
    });

    test.test('setSourceContext', function (test) {
        let error = new TwingError('foo', -1, 'bar');

        error.setSourceContext(null);

        test.equal(error.getSourceContext(), null);

        error.setSourceContext();

        test.equal(error.getSourceContext(), null);

        test.end();
    });

    test.test('updateRepr', function(test) {
        let error = new TwingError('foo', -1, 'bar');

        error.setSourceContext(new TwingSource('', 'bar', ''));

        test.same(error.getMessage(), 'foo in "bar"');

        error = new TwingError('foo', -1, {toString: function() {return 'bar';}});

        test.same(error.getMessage(), 'foo in "bar"');

        error = new TwingError('foo', -1, 1);

        test.same(error.getMessage(), 'foo in 1');

        test.end();
    });

    test.end();
});
