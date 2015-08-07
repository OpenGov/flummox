/**
 * Flux Component
 *
 * Component interface to reactComponentMethods module.
 *
 * Children of FluxComponent are given access to the flux instance via
 * `context.flux`. Use this near the top of your app hierarchy and all children
 * will have easy access to the flux instance (including, of course, other
 * Flux components!):
 *
 * <FluxComponent flux={flux}>
 *    ...the rest of your app
 * </FluxComponent>
 *
 * Now any child can access the flux instance again like this:
 *
 * <FluxComponent>
 *    ...children
 * </FluxComponent>
 *
 * We don't need the flux prop this time because flux is already part of
 * the context.
 *
 * The component has an optional prop `connectToStores`, which is passed to
 * `this.connectToStores` and used to set the initial state. The component's
 * state is injected as props to the child components.
 *
 * The practical upshot of all this is that fluxMixin, state changes, and
 * context are now simply implementation details. Among other things, this means
 * you can write your components as plain ES6 classes. Here's an example:
 *
 * class ParentComponent extends React.Component {
 *
 *   render() {
 *     <FluxComponent connectToStores="fooStore">
 *       <ChildComponent />
 *     </FluxComponent>
 *   }
 *
 * }
 *
 * ChildComponent in this example has props that sync with each of the
 * state keys of fooStore.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactComponentMethods = require('./reactComponentMethods');

var _reactComponentMethods2 = _interopRequireDefault(_reactComponentMethods);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

exports['default'] = function (React, PlainWrapperComponent) {
  var _createReactComponentMethods = _reactComponentMethods2['default'](React);

  var instanceMethods = _createReactComponentMethods.instanceMethods;
  var staticProperties = _createReactComponentMethods.staticProperties;

  var FluxComponent = (function (_React$Component) {
    _inherits(FluxComponent, _React$Component);

    function FluxComponent(props, context) {
      var _this = this;

      _classCallCheck(this, FluxComponent);

      _React$Component.call(this, props, context);

      this.wrapChild = function (child) {
        return React.addons.cloneWithProps(child, _objectAssign2['default'](_this.getExtraProps(), _this.state.storeState, _this.state.actions));
      };

      this.initialize();

      var stores = this._getStoresProp(props);
      var actions = this._getActionsProp(props);

      this.state = {
        storeState: this.connectToStores(stores, props.stateGetter),
        actions: this.collectActions(actions, props.actionGetter, props)
      };
    }

    FluxComponent.prototype.getExtraProps = function getExtraProps() {
      var _props = this.props;
      var children = _props.children;
      var render = _props.render;
      var connectToStores = _props.connectToStores;
      var stores = _props.stores;
      var injectActions = _props.injectActions;
      var actions = _props.actions;
      var actionGetter = _props.actionGetter;
      var stateGetter = _props.stateGetter;
      var flux = _props.flux;

      var extraProps = _objectWithoutProperties(_props, ['children', 'render', 'connectToStores', 'stores', 'injectActions', 'actions', 'actionGetter', 'stateGetter', 'flux']);

      return extraProps;
    };

    FluxComponent.prototype.render = function render() {
      var _props2 = this.props;
      var children = _props2.children;
      var render = _props2.render;

      if (typeof render === 'function') {
        return render(this.state.storeState, this.state.actions, this.getExtraProps());
      }

      if (!children) return null;

      if (!Array.isArray(children)) {
        var child = children;
        return this.wrapChild(child);
      } else {
        return React.createElement(
          PlainWrapperComponent,
          null,
          React.Children.map(children, this.wrapChild)
        );
      }
    };

    return FluxComponent;
  })(React.Component);

  _objectAssign2['default'](FluxComponent.prototype, instanceMethods);

  _objectAssign2['default'](FluxComponent, staticProperties);

  return FluxComponent;
};

module.exports = exports['default'];