'use strict';

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Flux2 = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function createSerializableStore(serializedState) {
  return (function (_Store) {
    _inherits(SerializableStore, _Store);

    function SerializableStore() {
      _classCallCheck(this, SerializableStore);

      _Store.apply(this, arguments);
    }

    SerializableStore.serialize = function serialize() {
      return serializedState;
    };

    SerializableStore.deserialize = function deserialize(stateString) {
      return {
        stateString: stateString,
        deserialized: true
      };
    };

    return SerializableStore;
  })(_Flux2.Store);
}

describe('Flux', function () {

  describe('#createStore()', function () {
    it('throws if key already exists', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store2) {
        _inherits(TestStore, _Store2);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store2.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.createStore.bind(flux, 'ExampleStore', TestStore)).to['throw']('You\'ve attempted to create multiple stores with key ExampleStore. ' + 'Keys must be unique.');
    });

    it('throws if Store is not a prototype of class', function () {
      var flux = new _Flux2.Flux();

      var ForgotToExtendStore = function ForgotToExtendStore() {
        _classCallCheck(this, ForgotToExtendStore);
      };

      expect(flux.createStore.bind(flux, 'Flux', ForgotToExtendStore)).to['throw']('You\'ve attempted to create a store from the class ' + 'ForgotToExtendStore, which does not have the base Store class in its ' + 'prototype chain. Make sure you\'re using the `extends` keyword: ' + '`class ForgotToExtendStore extends Store { ... }`');
    });

    it('registers store\'s handler with central dispatcher', function () {
      var ExampleStore = (function (_Store3) {
        _inherits(ExampleStore, _Store3);

        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          _Store3.apply(this, arguments);
        }

        return ExampleStore;
      })(_Flux2.Store);

      var spy1 = _sinon2['default'].spy();
      var spy2 = _sinon2['default'].spy();

      ExampleStore.prototype.foo = 'bar';
      ExampleStore.prototype.handler = function (_payload) {
        spy1(_payload);
        spy2(this.foo);
      };

      var flux = new _Flux2.Flux();
      flux.createStore('ExampleStore', ExampleStore);

      var payload = 'foobar';
      flux.dispatch('actionId', payload);
      expect(spy1.getCall(0).args[0].body).to.equal('foobar');
      expect(spy2.calledWith('bar')).to.be['true'];
    });

    it('returns the created store instance', function () {
      var ExampleStore = (function (_Store4) {
        _inherits(ExampleStore, _Store4);

        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          _Store4.apply(this, arguments);
        }

        return ExampleStore;
      })(_Flux2.Store);

      var flux = new _Flux2.Flux();
      var store = flux.createStore('ExampleStore', ExampleStore);
      expect(store).to.be.an.instanceOf(ExampleStore);
    });
  });

  describe('#getStore()', function () {
    it('retrieves store for key', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store5) {
        _inherits(TestStore, _Store5);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store5.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.getStore('ExampleStore')).to.be.an.instanceOf(_Flux2.Store);
      expect(flux.getStore('NonexistentStore')).to.be.undefined;
    });
  });

  describe('#removeStore()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store6) {
        _inherits(TestStore, _Store6);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store6.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.removeStore.bind(flux, 'NonexistentStore')).to['throw']('You\'ve attempted to remove store with key NonexistentStore which does not exist.');
    });

    it('deletes store instance', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store7) {
        _inherits(TestStore, _Store7);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store7.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      var store = flux.createStore('ExampleStore', TestStore);
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be['function'];
      flux.removeStore('ExampleStore');
      expect(flux._stores.ExampleStore).to.be.undefined;
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be.undefined;
    });
  });

  describe('#createActions()', function () {
    it('throws if key already exists', function () {
      var TestActions = {};

      var flux = new _Flux2.Flux();
      flux.createActions('ExampleActions', TestActions);

      expect(flux.createActions.bind(flux, 'ExampleActions', TestActions)).to['throw']('You\'ve attempted to create multiple actions with key ExampleActions. ' + 'Keys must be unique.');
    });

    it('accepts plain old JavaScript object', function () {
      var flux = new _Flux2.Flux();

      flux.createActions('foobar', {
        foo: function foo() {
          return 'bar';
        },

        bar: function bar() {
          return 'baz';
        }
      });

      expect(flux.getActions('foobar').foo()).to.equal('bar');
      expect(flux.getActions('foobar').bar()).to.equal('baz');
    });
  });

  describe('#getActions()', function () {
    var TestActions = {};

    it('retrieves actions for key', function () {
      var flux = new _Flux2.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActions('TestActions')).to.be.an.object;
      expect(flux.getActions('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#getActionIds() / #getConstants()', function () {
    var TestActions = {
      getFoo: function getFoo() {}
    };

    it('retrives ids of actions for key', function () {
      var flux = new _Flux2.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActionIds('TestActions').getFoo).to.be.a('string');
      expect(flux.getActionIds('NonexistentActions')).to.be.undefined;

      expect(flux.getConstants('TestActions').getFoo).to.be.a('string');
      expect(flux.getConstants('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#removeActions()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux2.Flux();
      var TestActions = {};

      flux.createActions('TestActions', TestActions);
      expect(flux.removeActions.bind(flux, 'NonexistentActions')).to['throw']('You\'ve attempted to remove actions with key NonexistentActions which does not exist.');
    });

    it('deletes actions instance', function () {
      var flux = new _Flux2.Flux();
      var TestActions = {};

      flux.createActions('TestActions', TestActions);
      flux.removeActions('TestActions');
      expect(flux._actions.TestActions).to.be.undefined;
    });
  });

  describe('#getAllActionIds() / #getAllConstants()', function () {
    var TestFooActions = {
      getFoo: function getFoo() {},
      getBar: function getBar() {}
    };

    var TestBarActions = {
      getFoo: function getFoo() {},
      getBar: function getBar() {}
    };

    it('retrives ids of all actions', function () {
      var flux = new _Flux2.Flux();
      flux.createActions('TestFooActions', TestFooActions);
      flux.createActions('TestBarActions', TestBarActions);

      expect(flux.getAllActionIds()).to.be.an('array');
      expect(flux.getAllActionIds()[0]).to.be.a('string');
      expect(flux.getAllActionIds()).to.have.length(4);

      expect(flux.getAllConstants()).to.be.an('array');
      expect(flux.getAllConstants()[0]).to.be.a('string');
      expect(flux.getAllConstants()).to.have.length(4);
    });
  });

  describe('#performAction()', function () {
    var testActions = {
      getFoo: function getFoo() {
        return { foo: 'bar' };
      },

      getBar: function getBar() {
        return { bar: 'baz' };
      },

      getBaz: function getBaz() {
        return;
      },

      asyncAction: function asyncAction(returnValue) {
        return regeneratorRuntime.async(function asyncAction$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              return context$3$0.abrupt('return', returnValue);

            case 1:
            case 'end':
              return context$3$0.stop();
          }
        }, null, this);
      },

      badAsyncAction: function badAsyncAction() {
        return Promise.reject(new Error('some error'));
      }
    };

    var TestActionsFlux = (function (_Flux) {
      _inherits(TestActionsFlux, _Flux);

      function TestActionsFlux() {
        _classCallCheck(this, TestActionsFlux);

        _Flux.call(this);

        this.testActions = this.createActions('test', testActions);
      }

      return TestActionsFlux;
    })(_Flux2.Flux);

    it('calls `dispatch()`', function () {
      var flux = new TestActionsFlux();
      var actions = flux.testActions;
      var dispatch = _sinon2['default'].stub(flux, 'dispatch');
      actions.getFoo();
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: 'bar' });
    });

    it('sends async return value to Flux#dispatchAsync', function callee$2$0() {
      var flux, actions, dispatch, response;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new TestActionsFlux();
            actions = flux.testActions;
            dispatch = _sinon2['default'].stub(flux, 'dispatchAsync');
            response = actions.asyncAction('foobar');

            expect(response.then).to.be.a('function');

            context$3$0.next = 7;
            return regeneratorRuntime.awrap(response);

          case 7:

            expect(dispatch.firstCall.args[1].then).to.be.a('function');

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('skips dispatch if return value is undefined', function () {
      var flux = new TestActionsFlux();
      var actions = flux.testActions;
      var dispatch = _sinon2['default'].stub(flux, 'dispatch');

      actions.getBaz();

      expect(dispatch.called).to.be['false'];
    });

    it('does not skip async dispatch, even if resolved value is undefined', function callee$2$0() {
      var flux, actions, dispatchAsync;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new TestActionsFlux();
            actions = flux.testActions;
            dispatchAsync = _sinon2['default'].stub(flux, 'dispatchAsync');
            context$3$0.next = 5;
            return regeneratorRuntime.awrap(actions.asyncAction(undefined));

          case 5:

            expect(dispatchAsync.called).to.be['true'];

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('returns value from wrapped action', function callee$2$0() {
      var flux, actions;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new TestActionsFlux();
            actions = flux.testActions;

            expect(actions.getFoo()).to.deep.equal({ foo: 'bar' });

            context$3$0.next = 5;
            return regeneratorRuntime.awrap(expect(actions.asyncAction('async result')).to.eventually.equal('async result'));

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('#dispatch()', function () {

    it('delegates to dispatcher', function () {
      var flux = new _Flux2.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });

    it('emits dispatch event', function () {
      var flux = new _Flux2.Flux();
      var listener = _sinon2['default'].spy();

      flux.addListener('dispatch', listener);

      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(listener.calledOnce).to.be['true'];
      expect(listener.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });
  });

  describe('#dispatchAsync()', function () {

    it('delegates to dispatcher', function callee$2$0() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux2.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(dispatch.callCount).to.equal(2);

            expect(dispatch.firstCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.firstCall.args[0].async).to.equal('begin');

            expect(dispatch.secondCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.secondCall.args[0].body).to.equal('foobar');
            expect(dispatch.secondCall.args[0].async).to.equal('success');

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('adds unique dispatch id to keep track of async actions', function callee$2$0() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux2.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(dispatch.firstCall.args[0].async).to.equal('begin');
            expect(dispatch.secondCall.args[0].async).to.equal('success');

            expect(dispatch.firstCall.args[0].dispatchId).to.equal(dispatch.secondCall.args[0].dispatchId);

            context$3$0.next = 11;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.reject(new Error())));

          case 11:

            expect(dispatch.thirdCall.args[0].async).to.equal('begin');
            expect(dispatch.getCall(3).args[0].async).to.equal('failure');

            expect(dispatch.thirdCall.args[0].dispatchId).to.equal(dispatch.getCall(3).args[0].dispatchId);

          case 14:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('emits dispatch event', function callee$2$0() {
      var flux, listener, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux2.Flux();
            listener = _sinon2['default'].spy();

            flux.addListener('dispatch', listener);

            actionId = 'actionId';
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.resolve('foobar')));

          case 6:

            expect(listener.calledTwice).to.be['true'];
            expect(listener.firstCall.args[0].actionId).to.equal(actionId);
            expect(listener.firstCall.args[0].async).to.equal('begin');
            expect(listener.secondCall.args[0].actionId).to.equal(actionId);
            expect(listener.secondCall.args[0].async).to.equal('success');

          case 11:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('resolves to value of given promise', function (done) {
      var flux = new _Flux2.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.eventually.equal('foobar').notify(done);
    });

    it('dispatches with error if promise rejects', function callee$2$0() {
      var flux, dispatch, actionId, error;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new _Flux2.Flux();
            dispatch = _sinon2['default'].spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = 'actionId';
            error = new Error('error');
            context$3$0.next = 7;
            return regeneratorRuntime.awrap(flux.dispatchAsync(actionId, Promise.reject(error)));

          case 7:

            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.firstCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.firstCall.args[0].async).to.equal('begin');
            expect(dispatch.secondCall.args[0].actionId).to.equal(actionId);
            expect(dispatch.secondCall.args[0].async).to.equal('failure');
            expect(dispatch.secondCall.args[0].error).to.be.an['instanceof'](Error);

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('emit errors that occur as result of dispatch', function callee$2$0() {
      var ExampleStore, flux, listener, actionId, store;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleStore = (function (_Store8) {
              _inherits(ExampleStore, _Store8);

              function ExampleStore() {
                _classCallCheck(this, ExampleStore);

                _Store8.apply(this, arguments);
              }

              return ExampleStore;
            })(_Flux2.Store);

            flux = new _Flux2.Flux();
            listener = _sinon2['default'].spy();

            flux.addListener('error', listener);

            actionId = 'actionId';
            store = flux.createStore('example', ExampleStore);

            store.registerAsync(actionId, null, function () {
              throw new Error('success error');
            }, function () {
              throw new Error('failure error');
            });

            context$3$0.next = 9;
            return regeneratorRuntime.awrap(expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.be.rejectedWith('success error'));

          case 9:
            expect(listener.calledOnce).to.be['true'];
            expect(listener.firstCall.args[0].message).to.equal('success error');

            context$3$0.next = 13;
            return regeneratorRuntime.awrap(expect(flux.dispatchAsync(actionId, Promise.reject(new Error('foobar')))).to.be.rejectedWith('failure error'));

          case 13:
            expect(listener.calledTwice).to.be['true'];
            expect(listener.secondCall.args[0].message).to.equal('failure error');

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('#removeAllStoreListeners', function () {
    it('removes all listeners from stores', function () {
      var TestStore = (function (_Store9) {
        _inherits(TestStore, _Store9);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store9.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      var flux = new _Flux2.Flux();
      var storeA = flux.createStore('storeA', TestStore);
      var storeB = flux.createStore('storeB', TestStore);

      var listener = function listener() {};

      storeA.addListener('change', listener);
      storeA.addListener('change', listener);
      storeB.addListener('change', listener);
      storeB.addListener('change', listener);

      expect(storeA.listeners('change').length).to.equal(2);
      expect(storeB.listeners('change').length).to.equal(2);

      flux.removeAllStoreListeners();

      expect(storeA.listeners('change').length).to.equal(0);
      expect(storeB.listeners('change').length).to.equal(0);
    });
  });

  describe('#serialize()', function () {

    it('returns state of all the stores as a JSON string', function () {
      var flux = new _Flux2.Flux();

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', createSerializableStore('baz state'));

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state',
        baz: 'baz state'
      });
    });

    it('ignores stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store10) {
        _inherits(TestStore, _Store10);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store10.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', TestStore);

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state'
      });
    });

    it('warns if any store classes .serialize() returns a non-string', function () {
      var flux = new _Flux2.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      flux.createStore('foo', createSerializableStore({}));
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The store with key \'foo\' was not serialized because the static ' + 'method `SerializableStore.serialize()` returned a non-string with ' + 'type \'object\'.');

      console.warn.restore();
    });

    it('warns and skips stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux2.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = (function (_Store11) {
        _inherits(TestStore, _Store11);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store11.apply(this, arguments);
        }

        TestStore.serialize = function serialize() {
          return 'state string';
        };

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('test', TestStore);
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `serialize()` method, but no ' + 'corresponding `deserialize()` method.');

      console.warn.restore();
    });
  });

  describe('#deserialize()', function () {

    it('converts a serialized string into state and uses it to replace state of stores', function () {
      var flux = new _Flux2.Flux();

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', createSerializableStore());

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state.stateString).to.equal('baz state');
      expect(bazStore.state.deserialized).to.be['true'];
    });

    it('warns and skips if passed string is invalid JSON', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store12) {
        _inherits(TestStore, _Store12);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store12.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('foo', TestStore);

      expect(flux.deserialize.bind(flux, 'not JSON')).to['throw']('Invalid value passed to `Flux#deserialize()`: not JSON');
    });

    it('warns and skips stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux2.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = (function (_Store13) {
        _inherits(TestStore, _Store13);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store13.apply(this, arguments);
        }

        TestStore.deserialize = function deserialize() {
          return {};
        };

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('test', TestStore);
      flux.deserialize('{"test": "test state"}');

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `deserialize()` method, but no ' + 'corresponding `serialize()` method.');

      console.warn.restore();
    });

    it('ignores stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux2.Flux();

      var TestStore = (function (_Store14) {
        _inherits(TestStore, _Store14);

        function TestStore() {
          _classCallCheck(this, TestStore);

          _Store14.apply(this, arguments);
        }

        return TestStore;
      })(_Flux2.Store);

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', TestStore);

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state).to.be['null'];
    });
  });
});