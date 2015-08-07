'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _FluxComponent = require('./FluxComponent');

var _FluxComponent2 = _interopRequireDefault(_FluxComponent);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var FluxComponent = _FluxComponent2['default'](_reactAddons2['default'], 'span');
exports.FluxComponent = FluxComponent;
var connect = _connect2['default'](_reactAddons2['default']);
exports.connect = connect;