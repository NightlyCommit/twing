import {Test} from "tape";
import TwingTestCacheStub from "../../cache-stub";
import TwingTestLoaderStub from "../../loader-stub";
import TwingTestEnvironmentStub from "../../environment-stub";

const path = require('path');
const tap = require('tap');
const sinon = require('sinon');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing', path.resolve('./build/node/twing.js'));

tap.test('environment', function (test: Test) {
    test.test('autoReloadCacheMiss', function (test: Test) {
        let cache = new TwingTestCacheStub();
        let loader = new TwingTestLoaderStub();
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(0);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate('foo');

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledOnce(cache['load']);

        test.end();
    });

    test.test('autoReloadCacheHit', function (test: Test) {
        let cache = new TwingTestCacheStub();
        let loader = new TwingTestLoaderStub();
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(0);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(true);

        twing.loadTemplate('foo');

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledTwice(cache['load']);

        test.end();
    });

    test.test('autoReloadOutdatedCacheHit', function (test: Test) {
        let cache = new TwingTestCacheStub();
        let loader = new TwingTestLoaderStub();
        let twing = new TwingTestEnvironmentStub(loader, {cache: cache, auto_reload: true, debug: false});

        let now = new Date();

        sinon.stub(cache, 'generateKey').returns('key');
        sinon.stub(cache, 'getTimestamp').returns(now);
        sinon.stub(cache, 'write');
        sinon.stub(cache, 'load');
        sinon.stub(loader, 'isFresh').returns(false);

        twing.loadTemplate('foo');

        sinon.assert.calledOnce(cache['generateKey']);
        sinon.assert.calledOnce(cache['getTimestamp']);
        sinon.assert.calledOnce(loader['isFresh']);
        sinon.assert.calledOnce(cache['write']);
        sinon.assert.calledOnce(cache['load']);

        test.end();
    });

    test.end();
});