"use strict";
const TwingMap = require("../../../../../lib/twing/map").TwingMap;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingSandboxSecurityPolicy = require("../../../../../lib/twing/sandbox/security-policy").TwingSandboxSecurityPolicy;
const TwingExtensionSandbox = require("../../../../../lib/twing/extension/sandbox").TwingExtensionSandbox;
const TwingSandboxSecurityError = require("../../../../../lib/twing/sandbox/security-error").TwingSandboxSecurityError;
const TwingSandboxSecurityNotAllowedMethodError = require("../../../../../lib/twing/sandbox/security-not-allowed-method-error").TwingSandboxSecurityNotAllowedMethodError;
const TwingSandboxSecurityNotAllowedFilterError = require("../../../../../lib/twing/sandbox/security-not-allowed-filter-error").TwingSandboxSecurityNotAllowedFilterError;
const TwingSandboxSecurityNotAllowedTagError = require("../../../../../lib/twing/sandbox/security-not-allowed-tag-error").TwingSandboxSecurityNotAllowedTagError;
const TwingSandboxSecurityNotAllowedPropertyError = require("../../../../../lib/twing/sandbox/security-not-allowed-property-error").TwingSandboxSecurityNotAllowedPropertyError;
const TwingSandboxSecurityNotAllowedFunctionError = require("../../../../../lib/twing/sandbox/security-not-allowed-function-error").TwingSandboxSecurityNotAllowedFunctionError;

const tap = require('tap');
const merge = require('merge');
const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('lib/runtime.js'));

class FooObject {
    constructor() {
        this.bar = 'bar';
    }

    toString() {
        let value = FooObject.called.get('toString');

        FooObject.called.set('toString', ++value);

        return 'foo';
    }

    foo() {
        let value = FooObject.called.get('foo');

        FooObject.called.set('foo', ++value);

        return 'foo';
    }

    getFooBar() {
        let value = FooObject.called.get('getFooBar');

        FooObject.called.set('getFooBar', ++value);

        return 'foobar';
    }
}

FooObject.called = new Map([['toString', 0], ['foo', 0], ['getFooBar', 0]]);

FooObject.reset = function () {
    FooObject.called = new Map([['toString', 0], ['foo', 0], ['getFooBar', 0]]);
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
    let policy = new TwingSandboxSecurityPolicy();
    twing.addExtension(new TwingExtensionSandbox(policy, sandboxed));

    policy.setAllowedTags(tags);
    policy.setAllowedFilters(filters);
    policy.setAllowedMethods(methods);
    policy.setAllowedProperties(properties);
    policy.setAllowedFunctions(functions);

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

    test.test('sandboxGloballySet', async function (test) {
        let twing = getEnvironment(false, {}, templates);

        test.same(await twing.loadTemplate('1_basic').render(params), 'FOO', 'Sandbox does nothing if it is disabled globally');

        test.end();
    });

    test.test('sandboxUnallowedMethodAccessor', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic1').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed method is called');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedMethodError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedMethodError');
            test.same(e.getClassName(), 'FooObject', 'Exception should be raised on the "FooObject" class');
            test.same(e.getMethodName(), 'foo', 'Exception should be raised on the "foo" method');
        }

        test.end();
    });

    test.test('sandboxUnallowedFilter', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic2').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed filter is called');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedFilterError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedFilterError');
            test.same(e.getFilterName(), 'upper', 'Exception should be raised on the "upper" filter');
        }

        test.end();
    });

    test.test('sandboxUnallowedTag', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic3').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed tag is used in the template');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedTagError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedTagError');
            test.same(e.getTagName(), 'if', 'Exception should be raised on the "if" tag');
        }

        test.end();
    });

    test.test('sandboxUnallowedProperty', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic4').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed property is called in the template');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedPropertyError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedPropertyError');
            test.same(e.getClassName(), 'FooObject', 'Exception should be raised on the "FooObject" class');
            test.same(e.getPropertyName(), 'bar', 'Exception should be raised on the "bar" property');
        }

        test.end();
    });

    test.test('sandboxUnallowedToString', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic5').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed method (toString()) is called in the template');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedMethodError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedMethodError');
            test.same(e.getClassName(), 'FooObject', 'Exception should be raised on the "FooObject" class');
            test.same(e.getMethodName(), 'tostring', 'Exception should be raised on the "toString" method');
        }

        test.end();
    });

    test.test('sandboxUnallowedToStringArray', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic6').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed method (toString()) is called in the template');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedMethodError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedMethodError');
            test.same(e.getClassName(), 'FooObject', 'Exception should be raised on the "FooObject" class');
            test.same(e.getMethodName(), 'tostring', 'Exception should be raised on the "toString" method');
        }

        test.end();
    });

    test.test('sandboxUnallowedFunction', async function (test) {
        let twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('1_basic7').render(params);

            test.fail('Sandbox throws a SecurityError exception if an unallowed function is called in the template');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedFunctionError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedFunctionError');
            test.same(e.getFunctionName(), 'cycle', 'Exception should be raised on the "cycle" function');
        }

        test.end();
    });

    test.test('sandboxAllowMethodFoo', async function (test) {
        let twing = getEnvironment(true, {}, templates, [], [], new TwingMap([[FooObject, 'foo']]));

        FooObject.reset();
        test.same(await twing.loadTemplate('1_basic1').render(params), 'foo', 'Sandbox allow some methods');
        test.same(FooObject.called.get('foo'), 1, 'Sandbox only calls method once');

        test.end();
    });

    test.test('sandboxAllowMethodToString', async function (test) {
        let twing = getEnvironment(true, {}, templates, [], [], new TwingMap([[FooObject, 'toString']]));

        FooObject.reset();
        test.same(await twing.loadTemplate('1_basic5').render(params), 'foo', 'Sandbox allow some methods');
        test.same(FooObject.called.get('toString'), 1, 'Sandbox only calls method once');

        test.end();
    });

    test.test('sandboxAllowMethodToStringDisabled', async function (test) {
        let twing = getEnvironment(false, {}, templates);

        FooObject.reset();
        test.same(await twing.loadTemplate('1_basic5').render(params), 'foo', 'Sandbox allow toString when sandbox disabled');
        test.same(FooObject.called.get('toString'), 1, 'Sandbox only calls method once');

        test.end();
    });

    test.test('sandboxAllowFilter', async function (test) {
        let twing = getEnvironment(true, {}, templates, [], ['upper']);

        test.same(await twing.loadTemplate('1_basic2').render(params), 'FABIEN', 'Sandbox allow some filters');

        test.end();
    });

    test.test('sandboxAllowTag', async function (test) {
        let twing = getEnvironment(true, {}, templates, ['if']);

        test.same(await twing.loadTemplate('1_basic3').render(params), 'foo', 'Sandbox allow some tags');

        test.end();
    });

    test.test('sandboxAllowProperty', async function (test) {
        let twing = getEnvironment(true, {}, templates, [], [], new TwingMap(), new TwingMap([[FooObject, 'bar']]));

        test.same(await twing.loadTemplate('1_basic4').render(params), 'bar', 'Sandbox allow some properties');

        test.end();
    });

    test.test('sandboxAllowFunction', async function (test) {
        let twing = getEnvironment(true, {}, templates, [], [], new TwingMap(), new TwingMap(), ['cycle']);

        test.same(await twing.loadTemplate('1_basic7').render(params), 'bar', 'Sandbox allow some functions');

        test.end();
    });

    test.test('sandboxAllowFunctionsCaseInsensitive', async function (test) {
        for (let name of ['getfoobar', 'getFoobar', 'getFooBar']) {
            let twing = getEnvironment(true, {}, templates, [], [], new TwingMap([[FooObject, name]]));
            FooObject.reset();
            test.same(await twing.loadTemplate('1_basic8').render(params), 'foobarfoobar', 'Sandbox allow methods in a case-insensitive way');
            test.same(FooObject.called.get('getFooBar'), 2, 'Sandbox only calls method once');
            test.same(await twing.loadTemplate('1_basic9').render(params), 'foobarfoobar', 'Sandbox allow methods via shortcut names (ie. without get/set)');
        }

        test.end();
    });

    test.test('sandboxLocallySetForAnInclude', async function (test) {
        let templates = new TwingMap([
            ['2_basic', '{{ obj.foo }}{% include "2_included" %}{{ obj.foo }}'],
            ['2_included', '{% if obj.foo %}{{ obj.foo|upper }}{% endif %}']
        ]);

        let twing = getEnvironment(false, {}, templates);
        test.same(await twing.loadTemplate('2_basic').render(params), 'fooFOOfoo', 'Sandbox does nothing if disabled globally and sandboxed not used for the include');

        templates = new TwingMap([
            ['3_basic', '{{ obj.foo }}{% sandbox %}{% include "3_included" %}{% endsandbox %}{{ obj.foo }}'],
            ['3_included', '{% if obj.foo %}{{ obj.foo|upper }}{% endif %}']
        ]);

        twing = getEnvironment(true, {}, templates);

        try {
            await twing.loadTemplate('3_basic').render(params);

            test.fail('Sandbox throws a SecurityError exception when the included file is sandboxed');
        }
        catch (e) {
            test.true(e instanceof TwingSandboxSecurityNotAllowedTagError, 'Exception should be an instance of TwingSandboxSecurityNotAllowedTagError');
            test.same(e.getTagName(), 'sandbox');
        }

        test.end();
    });

    test.test('macrosInASandbox', async function (test) {
        let twing = getEnvironment(true, {autoescape: 'html'}, {index: `
{%- import _self as macros %}

{%- macro test(text) %}<p>{{ text }}</p>{% endmacro %}

{{- macros.test('username') }}`}, ['macro', 'import'], ['escape']);

        test.same(await twing.loadTemplate('index').render(params), '<p>username</p>');

        test.end();
    });

    test.test('sandboxDisabledAfterIncludeFunctionError', async function (test) {
        let twing = getEnvironment(false, {}, templates);

        try {
            await twing.loadTemplate('1_include').render(params);

            test.fail('An exception should be thrown for this test to be valid.');
        }
        catch (e) {
            test.false(twing.getExtension('TwingExtensionSandbox').isSandboxed(), 'Sandboxed include() function call should not leave Sandbox enabled when an error occurs.');
        }

        test.end();
    });

    test.end();
});
