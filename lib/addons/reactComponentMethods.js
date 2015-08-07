/**
 * React Component methods. These are the primitives used to implement
 * fluxMixin and FluxComponent.
 *
 * Exposes a Flux instance as `this.flux`. This requires that flux be passed as
 * either context or as a prop (prop takes precedence). Children also are given
 * access to flux instance as `context.flux`.
 *
 * It also adds the method `connectToStores()`, which ensures that the component
 * state stays in sync with the specified Flux stores. See the inline docs
 * of `connectToStores` for details.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Flux = require('../Flux');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

exports['default'] = function (React) {
  var instanceMethods = {

    getChildContext: function getChildContext() {
      var flux = this.getFlux();

      if (!flux) return {};

      return { flux: flux };
    },

    getFlux: function getFlux() {
      return this.props.flux || this.context.flux;
    },

    _getActionsProp: function _getActionsProp(props) {
      return props.actions || props.injectActions;
    },

    _getStoresProp: function _getStoresProp(props) {
      return props.stores || props.connectToStores;
    },

    initialize: function initialize() {
      this._fluxStateGetters = [];
      this._fluxListeners = {};
      this.flux = this.getFlux();

      if (!(this.flux instanceof _Flux.Flux)) {
        // TODO: print the actual class name here
        throw new Error('Could not find Flux instance. Ensure that your component ' + 'has either `this.context.flux` or `this.props.flux`.');
      }
    },

    componentWillUnmount: function componentWillUnmount() {
      var flux = this.getFlux();

      for (var key in this._fluxListeners) {
        if (!this._fluxListeners.hasOwnProperty(key)) continue;

        var store = flux.getStore(key);
        if (typeof store === 'undefined') continue;

        var listener = this._fluxListeners[key];

        store.removeListener('change', listener);
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.updateStores(nextProps);
      this.updateActions(nextProps);
    },

    updateStores: function updateStores() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var state = this.getStoreState(props);
      this.setState({
        storeState: state
      });
    },

    getStoreState: function getStoreState() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      return this._fluxStateGetters.reduce(function (result, stateGetter) {
        var getter = stateGetter.getter;
        var stores = stateGetter.stores;

        var stateFromStores = getter(stores, props);
        return _objectAssign2['default'](result, stateFromStores);
      }, {});
    },

    updateActions: function updateActions() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var actions = this._getActionsProp(props);

      this.setState({
        actions: this.collectActions(actions, props.actionGetter, props)
      });
    },

    /**
     * Connect component to stores, get the combined initial state, and
     * subscribe to future changes. There are three ways to call it. The
     * simplest is to pass a single store key and, optionally, a state getter.
     * The state getter is a function that takes the store as a parameter and
     * returns the state that should be passed to the component's `setState()`.
     * If no state getter is specified, the default getter is used, which simply
     * returns the entire store state.
     *
     * The second form accepts an array of store keys. With this form, the state
     * getter is called once with an array of store instances (in the same order
     * as the store keys). the default getter performance a reduce on the entire
     * state for each store.
     *
     * The last form accepts an object of store keys mapped to state getters. As
     * a shortcut, you can pass `null` as a state getter to use the default
     * state getter.
     *
     * Returns the combined initial state of all specified stores.
     *
     * This way you can write all the initialization and update logic in a single
     * location, without having to mess with adding/removing listeners.
     *
     * @type {string|array|object} stateGetterMap - map of keys to getters
     * @returns {object} Combined initial state of stores
     */
    connectToStores: function connectToStores() {
      var _this = this;

      var stateGetterMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var stateGetter = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var flux = this.getFlux();

      function getStore(key) {
        var store = flux.getStore(key);

        if (typeof store === 'undefined') {
          throw new Error('Store with key \'' + key + '\' does not exist.');
        }

        return store;
      }

      if (typeof stateGetterMap === 'string') {
        var key = stateGetterMap;
        var store = getStore(key);
        var getter = createGetter(stateGetter, defaultStateGetter);

        this._fluxStateGetters.push({ stores: store, getter: getter });
        var listener = createStoreListener(this, store, getter);

        store.addListener('change', listener);
        this._fluxListeners[key] = listener;
      } else if (Array.isArray(stateGetterMap)) {
        (function () {
          var stores = stateGetterMap.map(getStore);
          var getter = createGetter(stateGetter, defaultReduceStateGetter);

          _this._fluxStateGetters.push({ stores: stores, getter: getter });
          var listener = createStoreListener(_this, stores, getter);

          stateGetterMap.forEach(function (key, index) {
            var store = stores[index];
            store.addListener('change', listener);
            _this._fluxListeners[key] = listener;
          });
        })();
      } else {
        for (var key in stateGetterMap) {
          var store = getStore(key);
          var getter = createGetter(stateGetterMap[key], defaultStateGetter);

          this._fluxStateGetters.push({ stores: store, getter: getter });
          var listener = createStoreListener(this, store, getter);

          store.addListener('change', listener);
          this._fluxListeners[key] = listener;
        }
      }

      return this.getStoreState();
    },

    collectActions: function collectActions() {
      var actionMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var actionGetter = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var props = arguments.length <= 2 || arguments[2] === undefined ? this.props : arguments[2];

      if (typeof actionMap === 'undefined') {
        return {};
      }

      var flux = this.getFlux();

      function getActions(key) {
        var actions = flux.getActions(key);

        if (typeof actions === 'undefined') {
          throw new Error('Actions with key \'' + key + '\' does not exist.');
        }

        return actions;
      }

      var collectedActions = {};

      if (typeof actionMap === 'string') {
        var key = actionMap;
        var actions = getActions(key);
        var getter = createGetter(actionGetter, defaultActionGetter);

        _objectAssign2['default'](collectedActions, getter(actions, props));
      } else if (Array.isArray(actionMap)) {
        var actions = actionMap.map(getActions);
        var getter = createGetter(actionGetter, defaultReduceActionGetter);

        _objectAssign2['default'](collectedActions, getter(actions, props));
      } else {
        for (var key in actionMap) {
          var actions = getActions(key);
          var getter = createGetter(actionMap[key], defaultActionGetter);

          _objectAssign2['default'](collectedActions, getter(actions, props));
        }
      }

      return collectedActions;
    }
  };

  var getterMapType = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.object]);

  var staticProperties = {
    contextTypes: {
      flux: React.PropTypes.instanceOf(_Flux.Flux)
    },

    childContextTypes: {
      flux: React.PropTypes.instanceOf(_Flux.Flux)
    },

    propTypes: {
      connectToStores: getterMapType,
      stores: getterMapType,
      injectActions: getterMapType,
      actions: getterMapType,
      flux: React.PropTypes.instanceOf(_Flux.Flux),
      render: React.PropTypes.func,
      stateGetter: React.PropTypes.func,
      actionGetter: React.PropTypes.func
    }
  };

  return { instanceMethods: instanceMethods, staticProperties: staticProperties };
};

function createStoreListener(component, store, storeStateGetter) {
  return (function () {
    var state = storeStateGetter(store, this.props);
    this.setState({
      storeState: _.extend({}, this.state.storeState, state)
    });
  }).bind(component);
}

function createGetter(value, defaultGetter) {
  if (typeof value !== 'function') {
    return defaultGetter;
  } else {
    return value;
  }
}

function defaultStateGetter(store) {
  return store.getStateAsObject();
}

function defaultReduceStateGetter(stores) {
  return stores.reduce(function (result, store) {
    return _objectAssign2['default'](result, store.getStateAsObject());
  }, {});
}

function defaultActionGetter(actions) {
  return actions;
}

function defaultReduceActionGetter(actions) {
  return actions.reduce(function (result, _actions) {
    return _objectAssign2['default'](result, _actions);
  }, {});
}
module.exports = exports['default'];
