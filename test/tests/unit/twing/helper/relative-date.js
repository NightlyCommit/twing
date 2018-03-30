const relativeDate = require('../../../../../lib/twing/helper/relative-date').relativeDate;

const tap = require('tap');
const sinon = require('sinon');
const luxon = require('luxon');

tap.test('relative-date', function (test) {
    let stub = sinon.stub(luxon.DateTime, 'local').returns(luxon.DateTime.fromJSDate(new Date(2000, 0, 1, 0, 0, 0)));

    test.same(relativeDate('+1year'), luxon.DateTime.fromJSDate(new Date(2001, 0, 1, 0, 0, 0)));
    test.same(relativeDate('-1year'), luxon.DateTime.fromJSDate(new Date(1999, 0, 1, 0, 0, 0)));
    test.same(relativeDate('+1month'), luxon.DateTime.fromJSDate(new Date(2000, 1, 1, 0, 0, 0)));
    test.same(relativeDate('-1month'), luxon.DateTime.fromJSDate(new Date(1999, 11, 1, 0, 0, 0)));
    test.same(relativeDate('+1day'), luxon.DateTime.fromJSDate(new Date(2000, 0, 2, 0, 0, 0)));
    test.same(relativeDate('-1day'), luxon.DateTime.fromJSDate(new Date(1999, 11, 31, 0, 0, 0)));
    test.same(relativeDate('+1hour'), luxon.DateTime.fromJSDate(new Date(2000, 0, 1, 1, 0, 0)));
    test.same(relativeDate('-1hour'), luxon.DateTime.fromJSDate(new Date(1999, 11, 31, 23, 0, 0)));
    test.same(relativeDate('+1minute'), luxon.DateTime.fromJSDate(new Date(2000, 0, 1, 0, 1, 0)));
    test.same(relativeDate('-1minute'), luxon.DateTime.fromJSDate(new Date(1999, 11, 31, 23, 59, 0)));
    test.same(relativeDate('+1second'), luxon.DateTime.fromJSDate(new Date(2000, 0, 1, 0, 0, 1)));
    test.same(relativeDate('-1second'), luxon.DateTime.fromJSDate(new Date(1999, 11, 31, 23, 59, 59)));

    test.same(relativeDate('+1 year'), luxon.DateTime.fromJSDate(new Date(2001, 0, 1, 0, 0, 0)));

    stub.restore();

    test.end();
});