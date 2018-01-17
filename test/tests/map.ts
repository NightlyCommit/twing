import {Test} from "tape";
import TwingMap from "../../src/map";

const tap = require('tap');

tap.test('TwingMap', function (test: Test) {
    // let map: TwingMap<any, any> = new TwingMap([
    //     [1, 'bar'],
    //     ['foo', 'foo'],
    //     [0, 'foo-bar']
    // ]);
    //
    // let map2: TwingMap<any, any> = new TwingMap([
    //     ['foo', 'barz'],
    //     ['bar', 'bar']
    // ]);
    //
    // test.equal(map.first(), 'bar', 'first() should return the first element of the map');
    // test.equal(map.includes('foo-bar'), true, 'includes() should returns true when the value passed as parameter is present in the map');
    // test.equal(map.includes('barz'), false, 'includes() should returns false when the value passed as parameter is not present in the map');
    // test.equal(map.join('|'), 'bar|foo|foo-bar', 'join() should join the map values with the separator passed as parameter');
    // test.equal(map.merge(map2).size, 4, 'merge() should merge the map with the map passed as parameter');
    // test.equal(map.merge(map2).get('foo'), 'barz', 'merge() should use the values of the map passed as parameter to resolve index conflicts');
    // test.equal(map.merge(map2) === map, false, 'merge() should return a new map');
    //
    // test.same(map.sort().first(), 'bar', 'sort() should sort the map by ascending values when no handler is passed');
    //
    // test.same(map.sort(function(a: any, b: any) {
    //     return a < b ? 1 : -1;
    // }).first(), 'foo-bar', 'sort() should sort the map by values using the handler passed as parameter');
    //
    // test.same(map.sortByKeys().first(), 'foo-bar', 'sortByKeys() should sort the map by ascending keys when no handler is passed');
    //
    // test.same(map.sortByKeys(function(a: any, b: any) {
    //     return '' + a <  '' + b ? 1 : -1;
    // }).first(), 'foo', 'sortByKeys() should sort the map by keys using the handler passed as parameter');
    //
    // test.equal(map.push('lorem').get(3), 'lorem', 'push() should add an item to the map with the current map size as index');

    test.end();
});