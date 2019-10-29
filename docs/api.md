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

To load a template from a Twing environment, call the ``load()`` function which returns a ``TwingTemplate`` instance:

```javascript
twing.load('index.html').then((template) => {
    // ...
});
```

To render the template with some variables, call the ``render()`` function:

```javascript
template.render({'the': 'variables', 'go': 'here'}).then((output) => {
    // ...
});
```

> The ``display()`` method is a shortcut to output the template directly. See [Output buffering](#output-buffering) section for more details.

You can also load and render the template in one fell swoop:

```javascript
twing.render('index.html', {'the': 'variables', 'go': 'here'}).then((output) => {
    // ...
});
```

If a template defines blocks, they can be rendered individually via the
``renderBlock()`` call:

```javascript
template.renderBlock('block_name', {'the': 'variables', 'go': 'here'}).then((output) => {
    // ...
});
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

* `cache` *string* or `false`

  An absolute path where to store the compiled templates, or `false` to disable caching (which is the default).

* `auto_reload` *boolean*

  Setting the `auto_reload` option to `true` enables templates to be recompiled whenever their content changes instead of fetching them from the cache. Note that this won't invalidate the environment inner cache but only the cache passed using the `cache` option. If you don't provide a value for the `auto_reload` option, it will be determined automatically based on the `debug` value.

* `strict_variables` *boolean*

  If set to `false`, Twing will silently ignore invalid variables (variables and or attributes/methods that do not exist) and replace them with a `null` value. When set to `true`, Twing throws an exception instead (default to `false`).

* `autoescape` *string*

  Sets the default auto-escaping strategy (`name`, `html`, `js`, `css`, `url`, `html_attr`, or a JavaScript callback that takes the template "filename" and returns the escaping strategy to use); set it to `false` to disable auto-escaping. The `name` escaping strategy determines the escaping strategy to use for a template based on the template filename extension (this strategy does not incur any overhead at runtime as auto-escaping is done at compilation time.)

* `optimizations` *integer*

  A flag that indicates which optimizations to apply (default to `-1` -- all optimizations are enabled; set it to `0` to disable).
  
* `source_map` *boolean* (defaults to `false`)
  
  If set to `true`, Twing will add source map support to the compiled template. The source map can then be retrieved after the rendering by calling `TwingEnvironment.getSourceMap()` method.
  
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

#### `TwingLoaderRelativeFilesystem`

`TwingLoaderRelativeFilesystem` loads templates from the filesystem, relatively to the template that initiated the loading.

Consider for example the following template located in `/foo/bar`:

{% raw %}
```twig
{% include "../index.html" %}
```
{% endraw %}

`../index.html` would resolve to `/foo/index.html`.

#### ``TwingLoaderArray``

``TwingLoaderArray`` loads a template from an object or a Map. It's passed strings bound to template names:

{% raw %}
```javascript
let loader = new TwingLoaderArray({
    'index.html': 'Hello {{ name }}!',
});
let twing = new TwingEnvironment(loader);

twing.render('index.html', {'name': 'Fabien'}).then((output) => {
    // ...
});
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

let twing = new TwingEnvironment(loader).then((output) => {
    // ...
});
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

The `isFresh()` method must return `true` if the current cached template is still fresh, given the last modification time, or `false` otherwise.

The `getSourceContext()` method must return an instance of `TwingSource`.

## Using Extensions

Twing extensions are packages that add new features to Twing. Using an extension is as simple as using the `addExtension()` method:

```javascript
twing.addExtension(new TwingExtensionSandbox());
```

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