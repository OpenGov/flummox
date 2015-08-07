'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _FluxComponent = require('./FluxComponent');

var _FluxComponent2 = _interopRequireDefault(_FluxComponent);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var FluxComponent = _FluxComponent2['default'](_reactNative2['default'], _reactNative.View);
exports.FluxComponent = FluxComponent;
var connect = _connect2['default'](_reactNative2['default']);
exports.connect = connect;