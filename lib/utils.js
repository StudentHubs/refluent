"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = function (x) {
    return Object.prototype.toString.call(x) === '[object Object]';
};
exports.clearUndef = function (obj, keys) {
    if (keys === void 0) { keys = Object.keys(obj); }
    return keys.reduce(function (res, k) {
        var _a;
        return (obj[k] === undefined ? res : __assign({}, res, (_a = {}, _a[k] = obj[k], _a)));
    }, {});
};
exports.shallowEqual = function (a, b) {
    if (Array.isArray(a)) {
        return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var keysA = Object.keys(a);
    if (keysA.length !== Object.keys(b).length)
        return false;
    return keysA.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && a[k] === b[k]; });
};
exports.isPlain = function (a) {
    return !a ||
        (typeof a !== 'function' &&
            (typeof a !== 'object' ||
                ['[object Date]', '[object Array]', '[object Object]'].includes(Object.prototype.toString.call(a))));
};
exports.select = function (selector, props, pushed) {
    switch (typeof selector) {
        case 'number':
            return props[selector];
        case 'string':
            return selector.split('.').reduce(function (res, k) { return res && res[k]; }, props);
        case 'function':
            return selector(props, pushed);
    }
    return null;
};
exports.Root = function (_a) {
    var next = _a.next, children = _a.children, props = __rest(_a, ["next", "children"]);
    if (next)
        return next(__assign({}, props, { children: children }));
    if (typeof children === 'function')
        return children(props);
    return children || null;
};
