var Flummox =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var _Store2 = __webpack_require__(1);

	var _Store3 = _interopRequireDefault(_Store2);

	var _createActions2 = __webpack_require__(2);

	var _createActions3 = _interopRequireDefault(_createActions2);

	var _flux = __webpack_require__(5);

	var _eventemitter3 = __webpack_require__(4);

	var _eventemitter32 = _interopRequireDefault(_eventemitter3);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _uniqueid = __webpack_require__(6);

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

	        if ((undefined) !== 'production') {
	          console.warn('The store with key \'' + key + '\' was not serialized because the static ' + ('method `' + className + '.serialize()` returned a non-string with type ') + ('\'' + typeof serializedStoreState + '\'.'));
	        }
	      }

	      stateTree[key] = serializedStoreState;

	      if (typeof store.constructor.deserialize !== 'function') {
	        var className = store.constructor.name;

	        if ((undefined) !== 'production') {
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

	      if ((undefined) !== 'production') {
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

	        if ((undefined) !== 'production') {
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Store
	 *
	 * Stores hold application state. They respond to actions sent by the dispatcher
	 * and broadcast change events to listeners, so they can grab the latest data.
	 * The key thing to remember is that the only way stores receive information
	 * from the outside world is via the dispatcher.
	 */

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _eventemitter3 = __webpack_require__(4);

	var _eventemitter32 = _interopRequireDefault(_eventemitter3);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _lodashLangIsPlainObject = __webpack_require__(8);

	var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

	var Store = (function (_EventEmitter) {
	  _inherits(Store, _EventEmitter);

	  /**
	   * Stores are initialized with a reference
	   * @type {Object}
	   */

	  function Store() {
	    _classCallCheck(this, Store);

	    _EventEmitter.call(this);

	    this.state = null;

	    // Map of action ids to collection of action handlers
	    // Async handlers are categorized as 'begin', 'success', or 'error'
	    // Non-async handlers are categorized as 'success'
	    this._handlers = {};

	    // Like above, except generic handlers are called for every action
	    this._genericHandlers = {
	      begin: [],
	      success: [],
	      failure: []
	    };

	    // Array of { matcher, handler }
	    // matcher is called with each payload
	    // handler is called if matcher returns true
	    this._matchHandlers = [];
	  }

	  Store.prototype.setState = function setState(newState) {
	    // Do a transactional state update if a function is passed
	    if (typeof newState === 'function') {
	      var prevState = this._isHandlingDispatch ? this._pendingState : this.state;

	      newState = newState(prevState);
	    }

	    if (this._isHandlingDispatch) {
	      this._pendingState = this._assignState(this._pendingState, newState);
	      this._emitChangeAfterHandlingDispatch = true;
	    } else {
	      this.state = this._assignState(this.state, newState);
	      this.emit('change');
	    }
	  };

	  Store.prototype.replaceState = function replaceState(newState) {
	    if (this._isHandlingDispatch) {
	      this._pendingState = this._assignState(undefined, newState);
	      this._emitChangeAfterHandlingDispatch = true;
	    } else {
	      this.state = this._assignState(undefined, newState);
	      this.emit('change');
	    }
	  };

	  Store.prototype.getStateAsObject = function getStateAsObject() {
	    return this.state;
	  };

	  Store.assignState = function assignState(oldState, newState) {
	    return _objectAssign2['default']({}, oldState, newState);
	  };

	  Store.prototype._assignState = function _assignState() {
	    return (this.constructor.assignState || Store.assignState).apply(undefined, arguments);
	  };

	  Store.prototype.forceUpdate = function forceUpdate() {
	    if (this._isHandlingDispatch) {
	      this._emitChangeAfterHandlingDispatch = true;
	    } else {
	      this.emit('change');
	    }
	  };

	  Store.prototype.register = function register(actionId, handler) {
	    actionId = ensureActionId(actionId);

	    if (typeof handler !== 'function') return;

	    var actionHandlers = this._handlers[actionId] || {};
	    var actionSuccessHandlers = actionHandlers.success || [];

	    actionSuccessHandlers.push(handler.bind(this));

	    actionHandlers.success = actionSuccessHandlers;
	    this._handlers[actionId] = actionHandlers;
	  };

	  Store.prototype.registerAsync = function registerAsync(actionId, beginHandler, successHandler, failureHandler) {
	    actionId = ensureActionId(actionId);

	    var actionHandlers = this._handlers[actionId] || {};

	    var newActionHandlers = {
	      begin: beginHandler,
	      success: successHandler,
	      failure: failureHandler
	    };

	    for (var handlerType in newActionHandlers) {
	      var handler = newActionHandlers[handlerType];

	      if (typeof handler !== 'function') continue;

	      var actionTypeHandlers = actionHandlers[handlerType] || [];

	      actionTypeHandlers.push(handler.bind(this));

	      actionHandlers[handlerType] = actionTypeHandlers;
	    }

	    this._handlers[actionId] = actionHandlers;
	  };

	  Store.prototype.registerAll = function registerAll(handler) {
	    if (typeof handler !== 'function') return;

	    this._genericHandlers.success.push(handler.bind(this));
	  };

	  Store.prototype.registerAllAsync = function registerAllAsync(beginHandler, successHandler, failureHandler) {
	    var newActionHandlers = {
	      begin: beginHandler,
	      success: successHandler,
	      failure: failureHandler
	    };

	    for (var handlerType in newActionHandlers) {
	      var handler = newActionHandlers[handlerType];

	      if (typeof handler !== 'function') continue;

	      this._genericHandlers[handlerType].push(handler.bind(this));
	    }
	  };

	  Store.prototype.registerMatch = function registerMatch(matcher, handler) {
	    var boundHandler = handler.bind(this);
	    boundHandler._isMatchHandler = true;
	    this._matchHandlers.push({
	      matcher: matcher,
	      handler: boundHandler
	    });
	  };

	  Store.prototype.waitFor = function waitFor(tokensOrStores) {
	    this._waitFor(tokensOrStores);
	  };

	  Store.prototype.handler = function handler(payload) {
	    var body = payload.body;
	    var actionId = payload.actionId;
	    var asyncType = payload['async'];
	    var actionArgs = payload.actionArgs;
	    var error = payload.error;

	    // Collect array of all matching action handlers
	    var actionHandlers = this._handlers[actionId] || {};
	    var genericHandlers = this._genericHandlers;
	    var matchHandlers = this._matchHandlers;

	    var matchedActionHandlers = [];

	    if (asyncType === 'begin' || asyncType === 'failure') {
	      var matchedAsyncActionHandlers = actionHandlers[asyncType];
	      var matchedAsyncGenericHandlers = genericHandlers[asyncType];

	      if (matchedAsyncActionHandlers) {
	        matchedActionHandlers = matchedActionHandlers.concat(matchedAsyncActionHandlers);
	      }

	      if (matchedAsyncGenericHandlers) {
	        matchedActionHandlers = matchedActionHandlers.concat(matchedAsyncGenericHandlers);
	      }
	    } else {
	      var matchedSuccessActionHandlers = actionHandlers.success;
	      var matchedSuccessGenericHandlers = genericHandlers.success;

	      if (matchedSuccessActionHandlers) {
	        matchedActionHandlers = matchedActionHandlers.concat(matchedSuccessActionHandlers);
	      }

	      if (matchedSuccessGenericHandlers) {
	        matchedActionHandlers = matchedActionHandlers.concat(matchedSuccessGenericHandlers);
	      }
	    }

	    // Collect handlers that match custom matcher functions
	    // These are collected separately because they always receive the payload
	    // as the sole argument.
	    var customMatchedActionHandlers = [];

	    for (var _iterator = matchHandlers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var matcher = _ref.matcher;
	      var handler = _ref.handler;

	      if (matcher(payload)) {
	        customMatchedActionHandlers.push(handler);
	      }
	    }

	    this._isHandlingDispatch = true;
	    this._pendingState = this._assignState(undefined, this.state);
	    this._emitChangeAfterHandlingDispatch = false;

	    var args = undefined;
	    var matchedArgs = customMatchedActionHandlers.length ? [payload, this._pendingState] : null;

	    switch (asyncType) {
	      case 'begin':
	        args = [payload, this._pendingState];
	        break;
	      case 'failure':
	        args = [error, payload, this._pendingState];
	        break;
	      default:
	        args = [body, payload, this._pendingState];
	    }

	    var argsStateIndex = args.length - 1;
	    var matchedArgsStateIndex = matchedArgs && matchedArgs.length - 1;

	    try {
	      var allHandlers = matchedActionHandlers.concat(customMatchedActionHandlers);
	      // Dispatch all handlers
	      for (var _iterator2 = allHandlers, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	        var _ref2;

	        if (_isArray2) {
	          if (_i2 >= _iterator2.length) break;
	          _ref2 = _iterator2[_i2++];
	        } else {
	          _i2 = _iterator2.next();
	          if (_i2.done) break;
	          _ref2 = _i2.value;
	        }

	        var actionHandler = _ref2;

	        var handlerArgs = actionHandler._isMatchHandler ? matchedArgs : args;
	        var transformedState = actionHandler.apply(undefined, handlerArgs);

	        _lodashLangIsPlainObject2['default'](transformedState) && this.setState(transformedState);

	        args[argsStateIndex] = this._pendingState;
	        matchedArgs && (matchedArgs[matchedArgsStateIndex] = this._pendingState);
	      }
	    } finally {
	      var emit = false;

	      if (this._emitChangeAfterHandlingDispatch) {
	        emit = true;
	        this.state = this._pendingState;
	      }

	      this._isHandlingDispatch = false;
	      this._pendingState = undefined;
	      this._emitChangeAfterHandlingDispatch = false;

	      if (emit) this.emit('change');
	    }
	  };

	  return Store;
	})(_eventemitter32['default']);

	exports['default'] = Store;

	function ensureActionId(actionOrActionId) {
	  return typeof actionOrActionId === 'function' ? actionOrActionId._id : actionOrActionId;
	}
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createActions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _uniqueid = __webpack_require__(6);

	var _uniqueid2 = _interopRequireDefault(_uniqueid);

	function createActions(perform, actionCreators) {
	  var baseId = _uniqueid2['default']();

	  return Object.keys(actionCreators).reduce(function (result, key) {
	    if (typeof actionCreators[key] !== 'function') {
	      result[key] = actionCreators[key];
	    } else {
	      (function () {
	        var id = baseId + '-' + key;
	        var action = function action() {
	          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	          }

	          return perform.apply(undefined, [id, actionCreators[key].bind(actionCreators)].concat(args));
	        };
	        action._id = id;
	        result[key] = action;
	      })();
	    }

	    return result;
	  }, {});
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }

	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;

	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  if (!this._events || !this._events[event]) return [];
	  if (this._events[event].fn) return [this._events[event].fn];

	  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
	    ee[i] = this._events[event][i].fn;
	  }

	  return ee;
	};

	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  if (!this._events || !this._events[event]) return false;

	  var listeners = this._events[event]
	    , len = arguments.length
	    , args
	    , i;

	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this);

	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true);

	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
	  if (!this._events || !this._events[event]) return this;

	  var listeners = this._events[event]
	    , events = [];

	  if (fn) {
	    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
	      events.push(listeners);
	    }
	    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
	      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
	        events.push(listeners[i]);
	      }
	    }
	  }

	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[event] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[event];
	  }

	  return this;
	};

	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;

	  if (event) delete this._events[event];
	  else this._events = {};

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the module.
	//
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.EventEmitter2 = EventEmitter;
	EventEmitter.EventEmitter3 = EventEmitter;

	//
	// Expose the module.
	//
	module.exports = EventEmitter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(7)


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	var count = 0;

	/**
	 * Generate a unique ID.
	 *
	 * Optionally pass a prefix to prepend, a suffix to append, or a
	 * multiplier to use on the ID.
	 *
	 * ```js
	 * uniqueId(); //=> '25'
	 *
	 * uniqueId({prefix: 'apple_'});
	 * //=> 'apple_10'
	 *
	 * uniqueId({suffix: '_orange'});
	 * //=> '10_orange'
	 *
	 * uniqueId({multiplier: 5});
	 * //=> 5, 10, 15, 20...
	 * ```
	 *
	 * To reset the `id` to zero, do `id.reset()`.
	 *
	 * @param  {Object} `options` Optionally pass a `prefix`, `suffix` and/or `multiplier.
	 * @return {String} The unique id.
	 * @api public
	 */

	var id = module.exports = function (options) {
	  options = options || {};

	  var prefix = options.prefix;
	  var suffix = options.suffix;

	  var id = ++count * (options.multiplier || 1);

	  if (prefix == null) {
	    prefix = '';
	  }

	  if (suffix == null) {
	    suffix = '';
	  }

	  return String(prefix) + id + String(suffix);
	};


	id.reset = function() {
	  return count = 0;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * @typechecks
	 */

	"use strict";

	var invariant = __webpack_require__(9);

	var _lastID = 1;
	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *
	 *         case 'city-update':
	 *           FlightPriceStore.price =
	 *             FlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	  function Dispatcher() {
	    this.$Dispatcher_callbacks = {};
	    this.$Dispatcher_isPending = {};
	    this.$Dispatcher_isHandled = {};
	    this.$Dispatcher_isDispatching = false;
	    this.$Dispatcher_pendingPayload = null;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   *
	   * @param {function} callback
	   * @return {string}
	   */
	  Dispatcher.prototype.register=function(callback) {
	    var id = _prefix + _lastID++;
	    this.$Dispatcher_callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   *
	   * @param {string} id
	   */
	  Dispatcher.prototype.unregister=function(id) {
	    invariant(
	      this.$Dispatcher_callbacks[id],
	      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
	      id
	    );
	    delete this.$Dispatcher_callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   *
	   * @param {array<string>} ids
	   */
	  Dispatcher.prototype.waitFor=function(ids) {
	    invariant(
	      this.$Dispatcher_isDispatching,
	      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
	    );
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this.$Dispatcher_isPending[id]) {
	        invariant(
	          this.$Dispatcher_isHandled[id],
	          'Dispatcher.waitFor(...): Circular dependency detected while ' +
	          'waiting for `%s`.',
	          id
	        );
	        continue;
	      }
	      invariant(
	        this.$Dispatcher_callbacks[id],
	        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
	        id
	      );
	      this.$Dispatcher_invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   *
	   * @param {object} payload
	   */
	  Dispatcher.prototype.dispatch=function(payload) {
	    invariant(
	      !this.$Dispatcher_isDispatching,
	      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
	    );
	    this.$Dispatcher_startDispatching(payload);
	    try {
	      for (var id in this.$Dispatcher_callbacks) {
	        if (this.$Dispatcher_isPending[id]) {
	          continue;
	        }
	        this.$Dispatcher_invokeCallback(id);
	      }
	    } finally {
	      this.$Dispatcher_stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   *
	   * @return {boolean}
	   */
	  Dispatcher.prototype.isDispatching=function() {
	    return this.$Dispatcher_isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @param {string} id
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
	    this.$Dispatcher_isPending[id] = true;
	    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
	    this.$Dispatcher_isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @param {object} payload
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
	    for (var id in this.$Dispatcher_callbacks) {
	      this.$Dispatcher_isPending[id] = false;
	      this.$Dispatcher_isHandled[id] = false;
	    }
	    this.$Dispatcher_pendingPayload = payload;
	    this.$Dispatcher_isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
	    this.$Dispatcher_pendingPayload = null;
	    this.$Dispatcher_isDispatching = false;
	  };


	module.exports = Dispatcher;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var baseForIn = __webpack_require__(11),
	    isArguments = __webpack_require__(10),
	    isObjectLike = __webpack_require__(12);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  var Ctor;

	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}

	module.exports = isPlainObject;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(13),
	    isObjectLike = __webpack_require__(12);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}

	module.exports = isArguments;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(14),
	    keysIn = __webpack_require__(15);

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(16),
	    isLength = __webpack_require__(17);

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	module.exports = isArrayLike;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(18);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(10),
	    isArray = __webpack_require__(19),
	    isIndex = __webpack_require__(20),
	    isLength = __webpack_require__(17),
	    isObject = __webpack_require__(21);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(22);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(23);

	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(24),
	    isLength = __webpack_require__(17),
	    isObjectLike = __webpack_require__(12);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(21);

	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(25);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(26),
	    isObjectLike = __webpack_require__(12);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(21);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ }
/******/ ]);