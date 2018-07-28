"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var memize = require("memize");
var cache_1 = require("./cache");
var utils_1 = require("./utils");
var Runner = /** @class */ (function () {
    function Runner(selectors, map, getState, setState) {
        var _this = this;
        this.cache = cache_1.default();
        this.mounted = false;
        this.capture = null;
        this.active = null;
        this.push = function (update, callback) {
            if (_this.capture) {
                Object.assign(_this.capture.pushed, update || {});
                if (callback)
                    _this.capture.callbacks.push({ call: callback });
            }
            else if (_this.active) {
                Object.assign(_this.active.state.pushed, _this.cache(update || {}, true));
                if (callback)
                    _this.active.state.callbacks.push({ call: callback });
            }
            else if (_this.mounted) {
                _this.setState(function (props, state) {
                    return _this.run(props, state, function () {
                        Object.assign(_this.active.state.pushed, _this.cache(update || {}, true));
                        if (callback)
                            _this.active.state.callbacks.push({ call: callback });
                    });
                });
            }
        };
        this.selectors = selectors;
        this.map = map;
        this.getState = getState;
        this.setState = setState;
    }
    Runner.prototype.createWatcher = function (selectors, map, extra) {
        var _this = this;
        var memoizedMap = memize(function (args) {
            _this.capture = { pushed: {}, callbacks: [] };
            var value = map.apply(null, args);
            if (typeof value === 'function')
                value();
            else if (value)
                Object.assign(_this.capture.pushed, value);
            var result = _this.capture;
            _this.capture = null;
            return result;
        }, { maxSize: 50 });
        return {
            getArgs: function () {
                return selectors
                    .map(function (s) { return utils_1.select(s, _this.active.props, _this.active.state.pushed); })
                    .concat(extra || []);
            },
            run: function (args, commit) {
                var _a;
                if (commit) {
                    var value = map.apply(null, args.concat(true));
                    if (typeof value === 'function')
                        return value;
                    if (value) {
                        Object.assign(_this.active.state.pushed, _this.cache(value, true));
                    }
                }
                else {
                    var _b = memoizedMap(args), pushed = _b.pushed, callbacks = _b.callbacks;
                    Object.assign(_this.active.state.pushed, _this.cache(pushed, true));
                    (_a = _this.active.state.callbacks).push.apply(_a, __spread(callbacks));
                }
            },
        };
    };
    Runner.prototype.runWatcher = function (watcher, commit) {
        var lastArgs = watcher[commit ? 'commitArgs' : 'renderArgs'];
        var args = (commit && watcher.renderArgs) || watcher.getArgs();
        if (!lastArgs || args.some(function (a, i) { return a !== lastArgs[i]; })) {
            if (commit && watcher.stop)
                watcher.stop();
            var stop_1 = watcher.run(args, commit);
            if (!commit) {
                if (stop_1)
                    stop_1();
                return __assign({}, watcher, { renderArgs: args });
            }
            return __assign({}, watcher, { commitArgs: args, renderArgs: args, stop: stop_1 });
        }
        return watcher;
    };
    Runner.prototype.runLayer = function (commit) {
        var _this = this;
        var prev = __assign({}, this.active.state.pushed);
        this.active.state.watchers = this.active.state.watchers.map(function (w) {
            return _this.runWatcher(w, commit);
        });
        if (!utils_1.shallowEqual(this.active.state.pushed, prev))
            this.runLayer(commit);
    };
    Runner.prototype.run = function (props, state, func, commit) {
        this.active = {
            props: props,
            state: {
                watchers: state.watchers || [],
                pushed: __assign({}, (state.pushed || {})),
                callbacks: __spread((state.callbacks || [])),
            },
        };
        if (func)
            func();
        this.runLayer(commit);
        var result = this.active.state;
        this.active = null;
        Object.keys(result).forEach(function (k) {
            if (state[k] && utils_1.shallowEqual(result[k], state[k]))
                result[k] = state[k];
        });
        if (utils_1.shallowEqual(result, state))
            return null;
        result.callbacks = result.callbacks.filter(function (c) { return !c.done; });
        return result;
    };
    Runner.prototype.load = function (props, state) {
        var _this = this;
        if (state)
            this.mounted = true;
        return this.run(props, { pushed: state && state.pushed }, function () {
            var loaded = false;
            var watch = function (sels, m, extra) {
                _this.active.state.watchers.push(_this.runWatcher(_this.createWatcher(sels, m, extra), !!state));
            };
            if (_this.selectors.length) {
                watch(_this.selectors, _this.map, _this.push);
            }
            else {
                var value = _this.map(function () {
                    var sels = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        sels[_i] = arguments[_i];
                    }
                    var m = sels.pop();
                    if (!sels.length) {
                        if (_this.capture) {
                            throw new Error('Get called in render');
                        }
                        if (_this.active) {
                            return m ? _this.active.state.pushed : _this.active.props;
                        }
                        return _this.getState(m);
                    }
                    if (loaded)
                        throw new Error('Watch called after load');
                    watch(sels, m);
                }, _this.push, !!state);
                if (typeof value === 'function') {
                    if (state)
                        _this.unmount = value;
                    else
                        value();
                }
                else if (value) {
                    Object.assign(_this.active.state.pushed, _this.cache(value, true));
                }
            }
            loaded = true;
        }, !!state);
    };
    return Runner;
}());
function default_1() {
    var selectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        selectors[_i] = arguments[_i];
    }
    return function (C) {
        if (C === void 0) { C = utils_1.Root; }
        var map = selectors.pop();
        if ((!selectors.length && map.length < 2) ||
            map.length <= selectors.length) {
            var mapResult_1 = selectors.length ? {} : null;
            var maps_1 = selectors.length ? [[selectors, map]] : [];
            var globalMaps_1 = {};
            return /** @class */ (function (_super) {
                __extends(DoPure, _super);
                function DoPure() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.state = { maps: {}, cache: cache_1.default(), pushed: null };
                    return _this;
                }
                DoPure.getDerivedStateFromProps = function (props, state) {
                    if (!mapResult_1) {
                        mapResult_1 =
                            map(function () {
                                var sels = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    sels[_i] = arguments[_i];
                                }
                                var m = sels.pop();
                                if (!sels.length)
                                    throw new Error('Get called in pure do');
                                maps_1.push([sels, m]);
                            }) || {};
                    }
                    var next = { maps: {}, pushed: {} };
                    maps_1.forEach(function (_a, i) {
                        var _b = __read(_a, 2), sels = _b[0], m = _b[1];
                        var args = sels.map(function (s) { return utils_1.select(s, props); });
                        if (args.every(utils_1.isPlain)) {
                            globalMaps_1[i] = globalMaps_1[i] || memize(m, { maxSize: 50 });
                            Object.assign(next.pushed, globalMaps_1[i].apply(null, args) || {});
                        }
                        else {
                            next.maps[i] = state.maps[i] || memize(m, { maxSize: 10 });
                            Object.assign(next.pushed, next.maps[i].apply(null, args) || {});
                        }
                    });
                    Object.assign(next.pushed, mapResult_1);
                    next.pushed = state.cache(next.pushed);
                    return next;
                };
                DoPure.prototype.render = function () {
                    return React.createElement(C, utils_1.clearUndef(__assign({}, this.props, this.state.pushed)));
                };
                return DoPure;
            }(React.Component));
        }
        return /** @class */ (function (_super) {
            __extends(Do, _super);
            function Do(props) {
                var _this = _super.call(this, props) || this;
                var runner = new Runner(selectors, map, function (v) { return (v ? _this.state.state.pushed : _this.props); }, function (func) {
                    _this.setState(function (_a) {
                        var state = _a.state;
                        var next = func(_this.props, state);
                        return next ? { state: next } : null;
                    });
                });
                _this.state = { runner: runner, state: runner.load(_this.props) };
                return _this;
            }
            Do.getDerivedStateFromProps = function (props, _a) {
                var runner = _a.runner, state = _a.state;
                var next = runner.run(props, state);
                return next ? { state: next } : null;
            };
            Do.prototype.componentDidMount = function () {
                var _a = this.state, runner = _a.runner, state = _a.state;
                this.setState({ state: runner.load(this.props, state) });
            };
            Do.prototype.componentDidUpdate = function () {
                var _a = this.state, runner = _a.runner, state = _a.state;
                var next = runner.run(this.props, state, function () {
                    state.callbacks.forEach(function (c) {
                        c.call();
                        c.done = true;
                    });
                }, true);
                if (next)
                    this.setState({ state: next });
            };
            Do.prototype.componentWillUnmount = function () {
                var _a = this.state, runner = _a.runner, state = _a.state;
                state.watchers.forEach(function (w) { return w.stop && w.stop(); });
                if (runner.unmount)
                    runner.unmount();
            };
            Do.prototype.render = function () {
                return React.createElement(C, utils_1.clearUndef(__assign({}, this.props, this.state.state.pushed)));
            };
            return Do;
        }(React.Component));
    };
}
exports.default = default_1;
