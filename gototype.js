(function() {
    'use strict';

    function Promise(object, method, args) {
        this.object = object;
        this.method = method;
        this.args = args.length > 1 ? args.slice(1) : [];
    }

    Promise.prototype = {
        "then": function(callback, context) {
            if (this.method instanceof Function) {
                var returnValue = this.method.apply(this.object, this.args);
                if (returnValue) {
                    (callback || function(){}).call(context || this.object, returnValue);
                }
            }
            return context;
        },

        "catch": function(callback) {
            if (this.method instanceof Function) {
                try {
                    this.method.apply(this.object, this.args);
                } catch(e) {
                    callback(e);
                }
            } else {
                callback(this.method + ' is not a function.');
            }
        }
    };

    function Go(obj) {
        if (this instanceof Go) {
            this.obj = obj;
        } else {
            return new Go(obj);
        }
    }

    Go.prototype = {
        "isDefined": function() {
            return typeof this.obj !== 'undefined';
        },

        "exists": function(key, options) {
            var options = Go(options || {}),
                key = this.get(key);
            if (Go(key).isDefined() === true) {
                options.if('yes').then();
                return true;
            } else {
                options.if('no').then();
                return false;
            }
        },

        "get": function(key) {
            var props = key.split('.'),
                item = this.obj;
            for (var i = 0; i < props.length; i++) {
                item = item[props[i]];
                if (Go(item).isDefined() === false) {
                    return item;
                }
            }
            return item;
        },

        "extend": function(object) {
            var i, prop,
                go = Go(object),
                keys = go.getKeys(),
                obj = (this instanceof Go) ? this.obj : Go.prototype;
            for (i = 0; i < keys.length; i++) {
                prop = keys[i];
                obj[prop] = object[prop];
            }
        },

        "getKeys": function() {
            var key, props = [];
            if (Object.keys) {
                props = Object.keys(this.obj);
            } else {
                for (key in this.obj) {
                    if (this.obj.hasOwnProperty(key)) {
                        props.push(key);
                    }
                }
            }
            return props.sort();
        },

        "if": function(methodString) {
            var method = this.get(methodString);
            return new Promise(this.obj, method, arguments);
        },

        "try": function(methodString) {
            var method = this.get(methodString);
            return new Promise(this.obj, method, arguments);
        }

    };

    exports.Go = Go;

})();
