/**
 * Higher-order component form of FluxComponent
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactComponentMethods = require('./reactComponentMethods');

var _reactComponentMethods2 = _interopRequireDefault(_reactComponentMethods);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * Top-level function which exports a version of the HoC for the given version
 * of React
 */

exports['default'] = function (React) {
  var _createReactComponentMethods = _reactComponentMethods2['default'](React);

  var instanceMethods = _createReactComponentMethods.instanceMethods;
  var staticProperties = _createReactComponentMethods.staticProperties;

  // Decorator-friendly interface
  return function (_ref) {
    var stores = _ref.stores;
    var stateGetter = _ref.stateGetter;
    var actions = _ref.actions;
    var actionGetter = _ref.actionGetter;
    return function (BaseComponent) {
      var ConnectedComponent = (function (_React$Component) {
        _inherits(ConnectedComponent, _React$Component);

        function ConnectedComponent(props, context) {
          _classCallCheck(this, ConnectedComponent);

          _React$Component.call(this, props, context);

          this.initialize();

          this.state = {
            storeState: this.connectToStores(stores, stateGetter),
            actions: this.collectActions(actions, actionGetter, props)
          };
        }

        ConnectedComponent.prototype.render = function render() {
          return React.createElement(BaseComponent, _extends({}, this.props, this.state.storeState, this.state.actions));
        };

        return ConnectedComponent;
      })(React.Component);

      _objectAssign2['default'](ConnectedComponent.prototype, instanceMethods);

      _objectAssign2['default'](ConnectedComponent, staticProperties);

      return ConnectedComponent;
    };
  };
};

module.exports = exports['default'];