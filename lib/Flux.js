/**
 * Flux
 *
 * The main Flux class.
 */

'use strict';

exports.__esModule = true;
var _bind = Function.prototype.bind;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Store2 = require('./Store');

var _Store3 = _interopRequireDefault(_Store2);

var _createActions2 = require('./createActions');

var _createActions3 = _interopRequireDefault(_createActions2);

var _flux = require('flux');

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _uniqueid = require('uniqueid');

var _uniqueid2 = _interopRequireDefault(_uniqueid);

var Flux = (function (_EventEmitter) {
  _inherits(Flux, _EventEmitter);

  function Flux() {
    _classCallCheck(this, Flux);

    _EventEmitter.call(this);

    this.dispatcher = new _flux.Dispatcher();

    this._stores = {};
    this._actions = {};

    this.performAction = this.performAction.bind(this);
  }

  // Aliases

  Flux.prototype.createStore = function createStore(key, _Store) {

    if (!(_Store.prototype instanceof _Store3['default'])) {
      var className = getClassName(_Store);

      throw new Error('You\'ve attempted to create a store from the class ' + className + ', which ' + 'does not have the base Store class in its prototype chain. Make sure ' + ('you\'re using the `extends` keyword: `class ' + className + ' extends ') + 'Store { ... }`');
    }

    if (this._stores.hasOwnProperty(key) && this._stores[key]) {
      throw new Error('You\'ve attempted to create multiple stores with key ' + key + '. Keys must ' + 'be unique.');
    }

    for (var _len = arguments.length, constructorArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      constructorArgs[_key - 2] = arguments[_key];
    }

    var store = new (_bind.apply(_Store, [null].concat(constructorArgs)))();
    var token = this.dispatcher.register(store.handler.bind(store));

    store._waitFor = this.waitFor.bind(this);
    store._token = token;
    store._getAllActionIds = this.getAllActionIds.bind(this);

    this._stores[key] = store;

    return store;
  };

  Flux.prototype.getStore = function getStore(key) {
    return this._stores.hasOwnProperty(key) ? this._stores[key] : undefined;
  };

  Flux.prototype.removeStore = function removeStore(key) {
    if (this._stores.hasOwnProperty(key)) {
      this._stores[key].removeAllListeners();
      this.dispatcher.unregister(this._stores[key]._token);
      delete this._stores[key];
    } else {
      throw new Error('You\'ve attempted to remove store with key ' + key + ' which does not exist.');
    }
  };

  Flux.prototype.createActions = function createActions(key, actionCreators) {
    if (this._actions[key]) {
      throw new Error('You\'ve attempted to create multiple actions with key ' + key + '. Keys ' + 'must be unique.');
    } else {
      var actions = _createActions3['default'](this.performAction, actionCreators);
      this._actions[key] = actions;
      return actions;
    }
  };

  Flux.prototype.getActions = function getActions(key) {
    return this._actions.hasOwnProperty(key) ? this._actions[key] : undefined;
  };

  Flux.prototype.getActionIds = function getActionIds(key) {
    var actions = this.getActions(key);

    if (!actions) return;

    return Object.keys(actions).reduce(function (result, methodName) {
      result[methodName] = actions[methodName]._id;
      return result;
    }, {});
  };

  Flux.prototype.removeActions = function removeActions(key) {
    if (this._actions.hasOwnProperty(key)) {
      delete this._actions[key];
    } else {
      throw new Error('You\'ve attempted to remove actions with key ' + key + ' which does not exist.');
    }
  };

  Flux.prototype.getAllActionIds = function getAllActionIds() {
    var actionIds = [];

    for (var key in this._actions) {
      var actionConstants = this.getActionIds(key);

      if (!actionConstants) continue;

      actionIds = actionIds.concat(getValues(actionConstants));
    }

    return actionIds;
  };

  Flux.prototype.performAction = function performAction(actionId, action) {
    for (var _len2 = arguments.length, actionArgs = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      actionArgs[_key2 - 2] = arguments[_key2];
    }

    var body = action.apply(null, actionArgs);

    var payload = {
      actionArgs: actionArgs
    };

    if (isPromise(body)) {
      this.dispatchAsync(actionId, body, payload);
    } else {
      if (typeof body !== 'undefined') {
        this.dispatch(actionId, body, payload);
      }
    }

    // Return original method's return value to caller
    return body;
  };

  Flux.prototype.dispatch = function dispatch(actionId, body, payloadFields) {
    this._dispatch({ actionId: actionId, body: body });
  };

  Flux.prototype.dispatchAsync = function dispatchAsync(actionId, promise, payloadFields) {
    var _this = this;

    var dispatchId = _uniqueid2['default']();

    var payload = _extends({
      actionId: actionId,
      dispatchId: dispatchId
    }, payloadFields);

    this._dispatch(_extends({}, payload, {
      async: 'begin'
    }));

    return promise.then(function (body) {
      _this._dispatch(_extends({}, payload, {
        async: 'success',
        body: body
      }));

      return body;
    }, function (error) {
      _this._dispatch(_extends({}, payload, {
        error: error,
        async: 'failure'
      }));
    })['catch'](function (error) {
      _this.emit('error', error);

      throw error;
    });
  };

  Flux.prototype._dispatch = function _dispatch(payload) {
    this.dispatcher.dispatch(payload);
    this.emit('dispatch', payload);
  };

  Flux.prototype.waitFor = function waitFor(tokensOrStores) {

    if (!Array.isArray(tokensOrStores)) tokensOrStores = [tokensOrStores];

    var ensureIsToken = function ensureIsToken(tokenOrStore) {
      return tokenOrStore instanceof _Store3['default'] ? tokenOrStore._token : tokenOrStore;
    };

    var tokens = tokensOrStores.map(ensureIsToken);

    this.dispatcher.waitFor(tokens);
  };

  Flux.prototype.removeAllStoreListeners = function removeAllStoreListeners(event) {
    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      store.removeAllListeners(event);
    }
  };

  Flux.prototype.serialize = function serialize() {
    var stateTree = {};

    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      var serialize = store.constructor.serialize;

      if (typeof serialize !== 'function') continue;

      var serializedStoreState = serialize(store.state);

      if (typeof serializedStoreState !== 'string') {
        var className = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The store with key \'' + key + '\' was not serialized because the static ' + ('method `' + className + '.serialize()` returned a non-string with type ') + ('\'' + typeof serializedStoreState + '\'.'));
        }
      }

      stateTree[key] = serializedStoreState;

      if (typeof store.constructor.deserialize !== 'function') {
        var className = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The class `' + className + '` has a `serialize()` method, but no ' + 'corresponding `deserialize()` method.');
        }
      }
    }

    return JSON.stringify(stateTree);
  };

  Flux.prototype.deserialize = function deserialize(serializedState) {
    var stateMap = undefined;

    try {
      stateMap = JSON.parse(serializedState);
    } catch (error) {
      var className = this.constructor.name;

      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Invalid value passed to `' + className + '#deserialize()`: ' + ('' + serializedState));
      }
    }

    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      var deserialize = store.constructor.deserialize;

      if (typeof deserialize !== 'function') continue;

      var storeStateString = stateMap[key];
      var storeState = deserialize(storeStateString);

      store.replaceState(storeState);

      if (typeof store.constructor.serialize !== 'function') {
        var className = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The class `' + className + '` has a `deserialize()` method, but no ' + 'corresponding `serialize()` method.');
        }
      }
    }
  };

  return Flux;
})(_eventemitter32['default']);

exports['default'] = Flux;
Flux.prototype.getConstants = Flux.prototype.getActionIds;
Flux.prototype.getAllConstants = Flux.prototype.getAllActionIds;
Flux.prototype.dehydrate = Flux.prototype.serialize;
Flux.prototype.hydrate = Flux.prototype.deserialize;

function getClassName(Class) {
  return Class.prototype.constructor.name;
}

function getValues(object) {
  var values = [];

  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;

    values.push(object[key]);
  }

  return values;
}

function isPromise(value) {
  return value && typeof value.then === 'function';
}

var Flummox = Flux;

exports.Flux = Flux;
exports.Flummox = Flummox;
exports.Store = _Store3['default'];