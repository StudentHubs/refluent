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
var React = require("react");
var do_1 = require("./do");
var yield_1 = require("./yield");
var utils_1 = require("./utils");
var wrap = function (mapComp) {
    var chain = function (map) { return wrap(function (C) { return mapComp(map(C)); }); };
    var comp;
    return Object.assign(function (props) { return React.createElement(comp || (comp = mapComp()), props); }, {
        do: function () {
            var selectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selectors[_i] = arguments[_i];
            }
            return chain(do_1.default.apply(void 0, __spread(selectors)));
        },
        transform: function (hoc) { return chain(function (C) {
            if (C === void 0) { C = utils_1.Root; }
            return (hoc ? hoc(C) : C);
        }); },
        yield: function (YieldComp) { return chain(yield_1.default(YieldComp)); },
    });
};
exports.Comp = wrap(function (C) {
    if (C === void 0) { C = utils_1.Root; }
    return C;
});
