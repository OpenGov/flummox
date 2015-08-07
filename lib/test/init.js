'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _es6Promise = require('es6-promise');

require('babel-runtime/regenerator/runtime');

var _jsdom2 = require('jsdom');

global.expect = _chai2['default'].expect;

_chai2['default'].use(_chaiAsPromised2['default']);

if (!global.Promise) global.Promise = _es6Promise.Promise;

global.document = _jsdom2.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;