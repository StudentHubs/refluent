"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var keys_to_object_1 = require("keys-to-object");
var dateCache = {};
var stringify = function (v) {
    var type = Object.prototype.toString.call(v);
    if (type === '[object String]')
        return "\uFFFF\"" + v;
    if (type === '[object Function]')
        throw new Error();
    if (v === null || typeof v !== 'object')
        return "\uFFFF" + v;
    if (type === '[object Date]')
        return "\uFFFF@" + v.getTime();
    if (type === '[object Array]') {
        return "\uFFFF(" + (v.map(stringify).join('') || '\uFFFF') + ")";
    }
    if (type === '[object Object]') {
        return "\uFFFF(" + Object.keys(v)
            .sort()
            .map(function (k) { return "" + k + stringify(v[k]); })
            .join('\uFFFF') + ")";
    }
    throw new Error();
};
var objCache = new WeakMap();
var strCache = new Map();
exports.default = (function () {
    var baseMethods = {};
    var methods = {};
    return function (obj, full) {
        return keys_to_object_1.default(Object.keys(obj), function (k) {
            var value = obj[k];
            if (k === 'children')
                return obj[k];
            var type = Object.prototype.toString.call(value);
            if (type === '[object Function]') {
                if (value.noCache)
                    return value;
                baseMethods[k] = value;
                return (methods[k] || (methods[k] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return baseMethods[k].apply(baseMethods, __spread(args));
                }));
            }
            if (full) {
                if (type === '[object Array]' || type === '[object Object]') {
                    if (objCache.has(value))
                        return objCache.get(value);
                    try {
                        var str = stringify(value);
                        if (strCache.has(str)) {
                            var result = strCache.get(str);
                            objCache.set(value, result);
                            return result;
                        }
                        strCache.set(str, value);
                    }
                    catch (error) { }
                    objCache.set(value, value);
                    return value;
                }
                if (type === '[object Date]') {
                    var time = value.getTime();
                    return dateCache[time] || (dateCache[time] = value);
                }
            }
            return value;
        });
    };
});
