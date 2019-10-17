Introduction
============

{% raw %}

This is the documentation for Twing, the TypeScript-written Node.js implementation of the [Twig Language][language-reference-url].

## Prerequisites

Twing needs at least **node.js 8.0.0** to run.

## Installation

The recommended way to install Twing is via npm:

`npm i twing --save`

## Basic API Usage

This section gives you a brief introduction to the node.js API for Twing.

```js
const {TwingEnvironment, TwingLoaderArray} = require('twing');

let loader = new TwingLoaderArray({
    'index.twig': 'Hello {{ name }}!'
});
let twing = new TwingEnvironment(loader);

twing.render('index.twig', {name: 'Fabien'}).then((output) => {
    // do something with the output
});
```

Twing uses a loader (`TwingLoaderArray`) to locate templates, and an environment (`TwingEnvironment`) to store the configuration.

The `render()` method loads the template passed as a first argument and renders it with the variables passed as a second argument.

As templates are generally stored on the filesystem, Twing also comes with a filesystem loader:

```js
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');

let loader = new TwingLoaderFilesystem('/path/to/templates');
let environment = new TwingEnvironment(loader);

environment.render('index.twig', {name: 'Fabien'}).then((output) => {
    // do something with the output
});
```

### Real-world example using Express

_Credit for this example goes to [stela5](https://github.com/stela5)._

   1. Create working directory and initialize dependencies:

        ```
        mkdir myapp myapp/templates && cd myapp
        npm init -y
        npm install --save express twing
        ```

   2. Create server.js:

        ```javascript
        const app = require('express')();
        const port = process.env.NODE_PORT || 3000;
        const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
        let loader = new TwingLoaderFilesystem('./templates');
        let twing = new TwingEnvironment(loader);
        
        app.get('/', function (req, res) {
          twing.render('index.twig', {'name': 'World'}).then((output) => {
              res.end(output);
          });
        });
        
        app.get('/name/:name', function (req, res) {      
          twing.render('index.twig', req.params).then((output) => {
            res.end(output);
          });
        });
        
        app.listen(port, () => {
          console.log('Node.js Express server listening on port '+port);
        });
        ```

   3. Create templates/index.twig:

        ```html
        <!doctype html>
        <html lang="en">
        <head>
            <link href="https://fonts.googleapis.com/css?family=Baloo+Tamma" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ij4KPHJlY3Qgd2lkdGg9IjYiIGhlaWdodD0iNiIgZmlsbD0iI2VlZSI+PC9yZWN0Pgo8ZyBpZD0iYyI+CjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiNlNmU2ZTYiPjwvcmVjdD4KPHJlY3QgeT0iMSIgd2lkdGg9IjMiIGhlaWdodD0iMiIgZmlsbD0iI2Q4ZDhkOCI+PC9yZWN0Pgo8L2c+Cjx1c2UgeGxpbms6aHJlZj0iI2MiIHg9IjMiIHk9IjMiPjwvdXNlPgo8L3N2Zz4=");
                }
                
                main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #282828;
                    font-family: Baloo Tamma, cursive;
                    height: 70vh;
                }
        
                span {
                   font-size: 5vw;
                }
        
                em {
                    font-size: 1.5vw;
                }
        
            </style>
        </head>
        <body>
            <main>
                <img src="https://svgur.com/i/1ja.svg">
                <span>Hello{{ ' ' + name|trim }}!</span>
            <em>Powered by Twing</em>
            </main>
        </body>
        </html>
        ```

   4. Start server:

        ```
        node server.js
        ```

   5. Browse to website:

        ![Hello World!][hello-world-image]

   6. Change url to /name/Bob (or any name you choose):

        ![Hello Bob!][hello-bob-image]

{% endraw %}

[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
[language-reference-url]: {{ site.baseurl }}{% link language-reference/index.md %}
[hello-world-image]: {{ site.baseurl }}/assets/hello-world.png
[hello-bob-image]: {{ site.baseurl }}/assets/hello-bob.png
