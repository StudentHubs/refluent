"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var comp_1 = require("./comp");
var utils_1 = require("./utils");
exports.default = comp_1.Comp;
exports.branch = function (test, pass, fail) {
    if (fail === void 0) { fail = utils_1.Root; }
    return function (props) {
        return React.createElement(utils_1.select(test, props) ? pass : fail, props);
    };
};
