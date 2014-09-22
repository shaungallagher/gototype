/*global Go:false, describe:false, it:false, expect:false, beforeEach:false */

var Go = require('./gototype').Go;
var assert = require('assert');

describe('Go.ifDefined', function() {
    it('should be defined', function() {
        var a = {},
            go = Go(a);
        assert.notEqual(go.ifDefined, undefined);
    });

    it('should return true for defined properties', function() {
        var a = {foo: 'bar'},
            go = Go(a);
        assert.equal(go.ifDefined('foo'), true);
    });

    it('should return true for nested properties', function() {
        var a = {foo: {bar: 'baz'}},
            go = Go(a);
        assert.equal(go.ifDefined('foo.bar'), true);
    });

    it('should return false for undefined properties', function() {
        var a = {foo: 'bar'},
            go = Go(a);
        assert.equal(go.ifDefined('bar'), false);
    });
});

describe('Go.get', function() {
    it('should return the value of the deep property', function() {
        var a = {b: {c: {d: 32}}},
            go = Go(a);
        assert.equal(go.get('b.c.d'), 32);
    });

    it('should return undefined for missing property', function() {
        var a = {b: 32},
            go = Go(a);
        assert.equal(go.get('b.c.d'), undefined);
    });
});

describe('Go.getKeys', function() {
    it('should return an object\'s keys', function() {
        var a = {
                "foo": 1,
                "bar": 2
            },
            keys = Go(a).getKeys();
        assert.equal(keys.length, 2);
        assert.notEqual(keys.indexOf('foo'), -1);
        assert.notEqual(keys.indexOf('bar'), -1);
    });

    it('should return the keys in order', function () {
        var a = { 'z': 1, 'y': 2, 'x': 3 },
            keys = Go(a).getKeys();
        assert.equal(keys[0], 'x');
        assert.equal(keys[keys.length - 1], 'z');
    });
});

describe('Go.if', function() {
    var fired,
        success,
        param,
        context,
        obj = {
            "foo": function() {
                fired = true;
                context = this;
                return 91;
            },
            "bar": 3
        },
        fn = function(p) {
            success = true;
            param = p;
        };

    beforeEach(function() {
        fired = false;
        success = false;
        param = null;
        context = null;
    });

    it('should check that the requested method is a function', function() {
        var go = Go(obj);
        go.if('bar').then(fn);
        assert.equal(success, false);
        go.if('foo').then(fn);
        assert.equal(success, true);
    });

    it('should run the requested method if a function', function() {
        var go = Go(obj);
        go.if('foo').then(fn);
        assert.equal(fired, true);
    });

    it('should pass the method\'s return value as param to callback', function() {
        var go = Go(obj);
        go.if('foo').then(fn);
        assert.equal(param, 91);
    });

    it('should apply the object as its own context', function() {
        var go = Go(obj);
        go.if('foo').then(fn);
        assert.equal(context, obj);
    });
});

describe('Go.try', function() {
    var success,
        error,
        obj = {
            "foo": function() {
                throw 'an error';
            }
        },
        fn = function(e) {
            success = true;
            error = e;
        };

    beforeEach(function() {
        success = null;
        error = null;
    });

    it('should fire the callback when an exception is thrown', function() {
        var go = Go(obj);
        go.try('foo').catch(fn);
        assert.equal(success, true);
    });

    it('should pass the error to the callback', function() {
        var go = Go(obj);
        go.try('foo').catch(fn);
        assert.equal(error, 'an error');
    });
});
