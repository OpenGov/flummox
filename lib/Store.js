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

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _lodashLangIsPlainObject = require('lodash/lang/isPlainObject');

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