"use strict";

const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingSandboxSecurityPolicy = require("../../../../../lib/twing/sandbox/security-policy").TwingSandboxSecurityPolicy;
const TwingExtensionSandbox = require("../../../../../lib/twing/extension/sandbox").TwingExtensionSandbox;
const TwingSandboxSecurityError = require("../../../../../lib/twing/sandbox/security-error").TwingSandboxSecurityError;

const tap = require('tap');
const merge = require('merge');
const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

class FooObject {
    constructor() {
        this.bar = 'bar';
    }

    __toString() {
        let value = FooObject.called.get('__toString');

        FooObject.called.set('__toString', value++);

        return 'foo';
    }

    foo() {
        let value = FooObject.called.get('foo');

        FooObject.called.set('foo', value++);

        return 'foo';
    }

    getFooBar() {
        let value = FooObject.called.get('getFooBar');

        FooObject.called.set('getFooBar', value++);

        return 'foobar';
    }
}

FooObject.called = new Map([['__toString', 0], ['foo', 0], ['getFooBar', 0]]);

FooObject.reset = function () {
    FooObject.called = new Map([['__toString', 0], ['foo', 0], ['getFooBar', 0]]);
};

let params = new Map();

params.set('name', 'Fabien');
params.set('obj', new FooObject());
params.set('arr', new Map([['obj', new FooObject()]]));

let templates = new Map([
    ['1_basic1', '{{ obj.foo }}'],
    ['1_basic2', '{{ name|upper }}'],
    ['1_basic3', '{% if name %}foo{% endif %}'],
    ['1_basic4', '{{ obj.bar }}'],
    ['1_basic5', '{{ obj }}'],
    ['1_basic6', '{{ arr.obj }}'],
    ['1_basic7', '{{ cycle(["foo","bar"], 1) }}'],
    ['1_basic8', '{{ obj.getfoobar }}{{ obj.getFooBar }}'],
    ['1_basic9', '{{ obj.foobar }}{{ obj.fooBar }}'],
    ['1_basic', '{% if obj.foo %}{{ obj.foo|upper }}{% endif %}'],
    ['1_layout', '{% block content %}{% endblock %}'],
    ['1_child', "{% extends \"1_layout\" %}\n{% block content %}\n{{ \"a\"|json_encode }}\n{% endblock %}"],
    ['1_include', '{{ include("1_basic1", sandboxed=true) }}']
]);

let getEnvironment = function (sandboxed, options, templates, tags = [], filters = [], methods = new Map(), properties = new Map(), functions = []) {
    let loader = new TwingLoaderArray(templates);
    let twing = new TwingEnvironment(loader, merge({debug: true, cache: false, autoescape: false}, options));
    let policy = new TwingSandboxSecurityPolicy(tags, filters, methods, properties, functions);
    twing.addExtension(new TwingExtensionSandbox(policy, sandboxed));

    return twing;
};

tap.test('TwingExtensionSandbox', function (test) {
    test.test('sandboxWithInheritance', async function (test) {
        let twing = getEnvironment(true, {}, templates, ['block']);

        try {
            await twing.loadTemplate('1_child').render({});

            test.fail();
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityError);
            test.same(e.getMessage(), 'Filter "json_encode" is not allowed in "1_child" at line 3.');
        }

        test.end();
    });

    test.end();
});
