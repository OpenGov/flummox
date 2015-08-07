'use strict';

exports.__esModule = true;
exports['default'] = addContext;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function addContext(Component, context, contextTypes) {
  return _react2['default'].createClass({
    childContextTypes: contextTypes,

    getChildContext: function getChildContext() {
      return context;
    },

    render: function render() {
      return _react2['default'].createElement(Component, this.props);
    }
  });
}

module.exports = exports['default'];