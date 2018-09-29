Twing for Developers
====================

This chapter describes the API to Twing and not the template language. It will
be most useful as reference to those implementing the template interface to
the application and not those who are creating Twig templates.

## Basics

Twing uses a central object called the **environment** (exported as class
``TwingEnvironment``). Instances of this class are used to store the
configuration and extensions, and are used to load templates from the file
system or other locations.

Most applications will create one ``TwingEnvironment`` object on application
initialization and use that to load templates. In some cases it's however
useful to have multiple environments side by side, if different configurations
are in use.

The simplest way to configure Twing to load templates for your application
looks roughly like this:

```javascript
let {TwingEnvironment, TwingLoaderFilesystem} = require('twing');

let loader = new TwingLoaderFilesystem('/path/to/templates');
let twing = new TwingEnvironment(loader, {
    'cache': '/path/to/compilation_cache',
});
```

This will create a template environment with the default settings and a loader
that looks up the templates in the ``/path/to/templates/`` folder. Different
loaders are available and you can also write your own if you want to load
templates from a database or other resources.

> Notice that the second argument of the environment is a hash of options.
The ``cache`` option is a compilation cache directory, where Twing caches
the compiled templates to avoid the parsing phase for sub-sequent
requests. It is very different from the cache you might want to add for
the evaluated templates. For such a need, you can use any available
JavaScript cache library.

## Rendering Templates

To load a template from a Twing environment, call the ``load()`` function which
returns a ``TwingTemplateWrapper`` instance:

```javascript
let template = twing.load('index.html');
```

To render the template with some variables, call the ``render()`` function:

```javascript
template.render({'the': 'variables', 'go': 'here'});
```

> The ``display()`` method is a shortcut to output the template directly. See [Output buffering](#output-buffering) section for more details.

You can also load and render the template in one fell swoop:

```javascript
twing.render('index.html', {'the': 'variables', 'go': 'here'});
```

If a template defines blocks, they can be rendered individually via the
``renderBlock()`` call:

```javascript
template.renderBlock('block_name', {'the': 'variables', 'go': 'here'});
```

## Events

### twing.on('template', function(name) {})

When a template is encountered, Twing environment emits a `template` event with the name of the encountered template.

## Environment Options

When creating a new ``TwingEnvironment`` instance, you can pass a hash of
options as the constructor second argument:

```javascript
let twing = new TwingEnvironment(loader, {debug: true});
```

The following options are available:

* `debug` *boolean*

  When set to `true`, the generated templates have a `__toString()` method that you can use to display the generated nodes (defaults to `false`).

* `charset` *string* (defaults to `utf-8`)

  The charset used by the templates.

* `base_template_class` *string* (defaults to `TwingTemplate`)

  The base template class to use for generated templates.

* `cache` *string* or `false`

  An absolute path where to store the compiled templates, or `false` to disable caching (which is the default).

* `auto_reload` *boolean*

  When developing with Twing, it's useful to recompile the template whenever the source code changes. If you don't provide a value for the `auto_reload` option, it will be determined automatically based on the `debug` value.

* `strict_variables` *boolean*

  If set to `false`, Twing will silently ignore invalid variables (variables and or attributes/methods that do not exist) and replace them with a `null` value. When set to `true`, Twing throws an exception instead (default to `false`).

* `autoescape` *string*

  Sets the default auto-escaping strategy (`name`, `html`, `js`, `css`, `url`, `html_attr`, or a JavaScript callback that takes the template "filename" and returns the escaping strategy to use); set it to `false` to disable auto-escaping. The `name` escaping strategy determines the escaping strategy to use for a template based on the template filename extension (this strategy does not incur any overhead at runtime as auto-escaping is done at compilation time.)

* `optimizations` *integer*

  A flag that indicates which optimizations to apply (default to `-1` -- all optimizations are enabled; set it to `0` to disable).
  
* `source_map` *string* or *boolean* (defaults to `false`)
  
  If set to a *string* or `true`, Twing will add source map support to the compiled template. The source map can then be retrieved after the rendering by calling `TwingEnvironment.getSourceMap()` method. If set to a *string*, specifies the intended location of the output file. Strongly recommended when outputting source maps so that they can properly refer back to their intended files.
  
## Loaders

Loaders are responsible for loading templates from a resource such as the file
system.

### Compilation Cache

All template loaders can cache the compiled templates on the filesystem for
future reuse. It speeds up Twing a lot as templates are only compiled once.
See the ``cache`` and ``auto_reload`` options of ``TwingEnvironment`` above
for more information.

### Built-in Loaders

Here is a list of the built-in loaders Twig provides:

#### ``TwingLoaderFilesystem``

``TwingLoaderFilesystem`` loads templates from the file system. This loader
can find templates in folders on the file system and is the preferred way to
load them:

```javascript
let loader = new TwingLoaderFilesystem(templateDir);
```

It can also look for templates in an array of directories:

```javascript
let loader = new TwingLoaderFilesystem([templateDir1, templateDir2]);
```

With such a configuration, Twing will first look for templates in
``templateDir1`` and if they do not exist, it will fallback to look for them
in the ``templateDir2``.

You can add or prepend paths via the ``addPath()`` and ``prependPath()``
methods:

```javascript
loader.addPath(templateDir3);
loader.prependPath(templateDir4);
```

The filesystem loader also supports namespaced templates. This allows to group
your templates under different namespaces which have their own template paths.

When using the ``setPaths()``, ``addPath()``, and ``prependPath()`` methods,
specify the namespace as the second argument (when not specified, these
methods act on the "main" namespace):

```javascript
loader.addPath(templateDir, 'admin');
```

Namespaced templates can be accessed via the special
``@namespace_name/template_path`` notation:

```javascript
twing.render('@admin/index.html', {});
```

``TwingLoaderFilesystem`` support absolute and relative paths. Using relative
paths is preferred as it makes the cache keys independent of the project root
directory (for instance, it allows warming the cache from a build server where
the directory might be different from the one used on production servers):

```javascript
let loader = new TwingLoaderFilesystem('templates', process.cwd() + '/..');
```

> When not passing the root path as a second argument, Twing uses ``process.cwd()``
for relative paths.

#### ``TwingLoaderArray``

``TwingLoaderArray`` loads a template from an object or a Map. It's passed strings bound to template names:

{% raw %}
```javascript
let loader = new TwingLoaderArray({
    'index.html': 'Hello {{ name }}!',
});
let twing = new TwingEnvironment(loader);

twing.render('index.html', {'name': 'Fabien'});
```
{% endraw %}

This loader is very useful for unit testing. It can also be used for small
projects where storing all templates in a single JavaScript file might make sense.

> When using the ``Array`` loader with a cache mechanism, you
should know that a new cache key is generated each time a template content
"changes" (the cache key being the source code of the template). If you
don't want to see your cache grows out of control, you need to take care
of clearing the old cache file by yourself.

#### ``TwingLoaderChain``

``TwingLoaderChain`` delegates the loading of templates to other loaders:

{% raw  %}
```javascript
let loader1 = new TwingLoaderArray({
    'base.html': '{% block content %}{% endblock %}',
});
let loader2 = new TwingLoaderArray({
    'index.html': '{% extends "base.html" %}{% block content %}Hello {{ name }}{% endblock %}',
    'base.html': 'Will never be loaded',
});

let loader = new TwingLoaderChain([loader1, loader2]);

let twing = new TwingEnvironment(loader);
```
{% endraw %}

When looking for a template, Twing will try each loader in turn and it will
return as soon as the template is found. When rendering the ``index.html``
template from the above example, Twing will load it with ``loader2`` but the
``base.html`` template will be loaded from ``loader1``.

``TwingLoaderChain`` accepts any loader that implements
``TwingLoaderInterface``.

> You can also add loaders via the ``addLoader()`` method.

### Create your own Loader

All loaders must implement the ``TwingLoaderInterface`` declared in `lib/loader-interface.d.ts`:

```typescript
interface TwingLoaderInterface {
    /**
     * Returns the source context for a given template logical name.
     *
     * @param {string} name The template logical name
     *
     * @returns TwingSource
     *
     * @throws TwingErrorLoader When name is not found
     */
    getSourceContext(name: string): TwingSource;

    /**
     * Gets the cache key to use for the cache for a given template name.
     *
     * @param {string} name The name of the template to load
     *
     * @returns string The cache key
     *
     * @throws TwingErrorLoader When name is not found
     */
    getCacheKey(name: string): string;

    /**
     * Returns true if the template is still fresh.
     *
     * @param {string} name The template name
     * @param {number} time Timestamp of the last modification time of the
     * cached template
     *
     * @returns boolean true if the template is fresh, false otherwise
     *
     * @throws TwingErrorLoader When name is not found
     */
    isFresh(name: string, time: number): boolean;

    /**
     * Check if we have the source code of a template, given its name.
     *
     * @param {string} name The name of the template to check if we can load
     *
     * @returns boolean If the template source code is handled by this loader or not
     */
    exists(name: string): boolean;
    
    /**
     * Resolve the path of a template, given its name, whatever it means in the context of the loader.
     *
     * @param {string} name The name of the template to resolve
     *
     * @returns {string} The resolved path of the template
     */
    resolve(name: string): string;
}
```

The `isFresh()` method must return `true` if the current cached template
is still fresh, given the last modification time, or `false` otherwise.

The `getSourceContext()` method must return an instance of `TwingSource`.

## Using Extensions

Twing extensions are packages that add new features to Twing. Using an
extension is as simple as using the `addExtension()` method:

```javascript
twing.addExtension(new TwingExtensionSandbox());
```

Twing comes bundled with the following extensions:

* *TwingExtensionCore*: Defines all the core features of Twing.

* *TwingExtensionEscaper*: Adds automatic output-escaping and the possibility
  to escape/unescape blocks of code.

* *TwingExtensionSandbox*: Adds a sandbox mode to the default Twing
  environment, making it safe to evaluate untrusted code.

* *TwingExtensionProfiler*: Enabled the built-in Twing profiler.

* *TwingExtensionOptimizer*: Optimizes the node tree before compilation.

The core, escaper, and optimizer extensions do not need to be added to the
Twing environment, as they are registered by default.

## Built-in Extensions

This section describes the features added by the built-in extensions.

> Read the chapter about extending Twing to learn how to create your own
extensions.

### Core Extension

The ``core`` extension defines all the core features of Twig:

* Tags
* Filters
* Functions
* Tests

### Escaper Extension

The ``escaper`` extension adds automatic output escaping to Twing. It defines a
tag, ``autoescape``, and a filter, ``raw``.

When creating the escaper extension, you can switch on or off the global
output escaping strategy:

```javascript
let escaper = new TwingExtensionEscaper('html');
twing.addExtension(escaper);
```

If set to ``html``, all variables in templates are escaped (using the ``html``
escaping strategy), except those using the ``raw`` filter:

{% raw  %}
```twig
{{ article.to_html|raw }}
```
{% endraw  %}

You can also change the escaping mode locally by using the ``autoescape`` tag:

{% raw  %}
```twig
{% autoescape 'html' %}
    {{ var }}
    {{ var|raw }}      {# var won't be escaped #}
    {{ var|escape }}   {# var won't be double-escaped #}
{% endautoescape %}
```
{% endraw  %}

> The ``autoescape`` tag has no effect on included files.

The escaping rules are implemented as follows:

* Literals (integers, booleans, arrays, ...) used in the template directly as
  variables or filter arguments are never automatically escaped:

{% raw  %}
```twig
{{ "Twing<br />" }} {# won't be escaped #}

{% set text = "Twing<br />" %}
{{ text }} {# will be escaped #}
```
{% endraw  %}


* Expressions which the result is always a literal or a variable marked safe
  are never automatically escaped:

{% raw  %}
```twig
{{ foo ? "Twing<br />" : "<br />Twing" }} {# won't be escaped #}

{% set text = "Twing<br />" %}
{{ foo ? text : "<br />Twing" }} {# will be escaped #}

{% set text = "Twing<br />" %}
{{ foo ? text|raw : "<br />Twing" }} {# won't be escaped #}

{% set text = "Twing<br />" %}
{{ foo ? text|escape : "<br />Twing" }} {# the result of the expression won't be escaped #}
```
{% endraw  %}

* Escaping is applied before printing, after any other filter is applied:

{% raw  %}
```twig
{{ var|upper }} {# is equivalent to {{ var|upper|escape }} #}
```
{% endraw  %}

* The `raw` filter should only be used at the end of the filter chain:

{% raw  %}
```twig
{{ var|raw|upper }} {# will be escaped #}

{{ var|upper|raw }} {# won't be escaped #}
```
{% endraw  %}

* Automatic escaping is not applied if the last filter in the chain is marked
  safe for the current context (e.g. ``html`` or ``js``). ``escape`` and
  ``escape('html')`` are marked safe for HTML, ``escape('js')`` is marked
  safe for JavaScript, ``raw`` is marked safe for everything.

{% raw  %}
```twig
{% autoescape 'js' %}
    {{ var|escape('html') }} {# will be escaped for HTML and JavaScript #}
    {{ var }} {# will be escaped for JavaScript #}
    {{ var|escape('js') }} {# won't be double-escaped #}
{% endautoescape %}
```
{% endraw  %}

{% raw  %}
> Note that autoescaping has some limitations as escaping is applied on
expressions after evaluation. For instance, when working with
concatenation, ``{{ foo|raw ~ bar }}`` won't give the expected result as
escaping is applied on the result of the concatenation, not on the
individual variables (so, the ``raw`` filter won't have any effect here).
{% endraw  %}

### Sandbox Extension

The ``sandbox`` extension can be used to evaluate untrusted code. Access to
unsafe attributes and methods is prohibited. The sandbox security is managed
by a policy instance. By default, Twing comes with one policy class:
``TwingSandboxSecurityPolicy``. This class allows you to white-list some
tags, filters, properties, and methods:

```javascript
let tags = ['if'];
let filters = ['upper'];
let methods = new Map([
    ['Article', ['getTitle', 'getBody']],
]);
let properties = new Map([
    ['Article', ['title', 'body']],
]);
let functions = ['range'];
let policy = new TwingSandboxSecurityPolicy(tags, filters, methods, properties, functions);
```

With the previous configuration, the security policy will only allow usage of
the ``if`` tag, and the ``upper`` filter. Moreover, the templates will only be
able to call the ``getTitle()`` and ``getBody()`` methods on ``Article``
objects, and the ``title`` and ``body`` public properties. Everything else
won't be allowed and will generate a ``TwingSandboxSecurityError`` exception.

The policy object is the first argument of the sandbox constructor:

```javascript
let sandbox = new TwingExtensionSandbox(policy);
twing.addExtension(sandbox);
```

By default, the sandbox mode is disabled and should be enabled when including
untrusted template code by using the ``sandbox`` tag:

{% raw  %}
```twig
{% sandbox %}
    {% include 'user.html' %}
{% endsandbox %}
```
{% endraw  %}

You can sandbox all templates by passing ``true`` as the second argument of
the extension constructor:

```javascript
let sandbox = new TwingExtensionSandbox(policy, true);
````

### Profiler Extension

The ``profiler`` extension enables a profiler for Twing templates; it should
only be used on your development machines as it adds some overhead:

```javascript
let profile = new TwingProfilerProfile();
twing.addExtension(new TwingExtensionProfiler(profile));

let dumper = new TwingProfilerDumperText();
let dump = dumper.dump(profile);
```

A profile contains information about time and memory consumption for template,
block, and macro executions.

You can also dump the data in a `Blackfire.io <https://blackfire.io/>`_
compatible format:

```javascript
let dumper = new TwingProfilerDumperBlackfire();
fs.writeFileSync('/path/to/profile.prof', dumper.dump(profile));
```

Upload the profile to visualize it (create a `free account
<https://blackfire.io/signup>`_ first):

```bash
blackfire --slot=7 upload /path/to/profile.prof
```

### Optimizer Extension

The ``optimizer`` extension optimizes the node tree before compilation:

```javascript
twing.addExtension(new TwingExtensionOptimizer());
```

By default, all optimizations are turned on. You can select the ones you want
to enable by passing them to the constructor:

```javascript
let optimizer = new TwingExtensionOptimizer(TwingNodeVisitorOptimizer.OPTIMIZE_FOR);

twing.addExtension(optimizer);
```

Twing supports the following optimizations:

* ``TwingNodeVisitorOptimizer.OPTIMIZE_ALL``, enables all optimizations
  (this is the default value).
* ``TwingNodeVisitorOptimizer.OPTIMIZE_NONE``, disables all optimizations.
  This reduces the compilation time, but it can increase the execution time
  and the consumed memory.
* ``TwingNodeVisitorOptimizer.OPTIMIZE_FOR``, optimizes the ``for`` tag by
  removing the ``loop`` variable creation whenever possible.
* ``TwingNodeVisitorOptimizer.OPTIMIZE_RAW_FILTER``, removes the ``raw``
  filter whenever possible.
* ``TwingNodeVisitorOptimizer.OPTIMIZE_VAR_ACCESS``, simplifies the creation
  and access of variables in the compiled templates whenever possible.

## Exceptions

Twing can throw exceptions:

* ``TwingError``: The base exception for all errors.

* ``TwingErrorSyntax``: Thrown to tell the user that there is a problem with
  the template syntax.

* ``TwingErrorRuntime``: Thrown when an error occurs at runtime (when a filter
  does not exist for instance).

* ``TwingErrorLoader``: Thrown when an error occurs during template loading.

* ``TwingSandboxSecurityError``: Thrown when an unallowed tag, filter, or
  method is called in a sandboxed template.

## Output buffering<a name="output-buffering"></a>

Twing offers an output buffering mechanism that allows developers to control when output is sent. This mechanism is implemented by `TwingOutputBuffering`.

Output buffers are stackable, that is, you may call `TwingOutputBuffering.obStart()` while another `TwingOutputBuffering.obStart()` is active.

When no output buffer is active, `TwingOutputBuffering.echo()` writes to _process.stdout_. This is what happens when the function `TwingTemplate.display` is called. On most systems, _process.stdout_ is linked to the console, but it is trivial to route _process.stdout_ somewhere else.

When an output buffer is active, `TwingOutputBuffering.echo()` writes to this active buffer. The content of the active output buffer can be retrieved by calling `TwingOutputBuffering.obGetContents()`. The active buffer can be ended and unstacked by calling `TwingOutputBuffering.obEndClean()`.

> See `lib/output-buffering.d.ts` for implementation details.


[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}