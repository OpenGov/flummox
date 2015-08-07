'use strict';

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Flux13 = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('Store', function () {
  var ExampleStore = (function (_Store) {
    _inherits(ExampleStore, _Store);

    function ExampleStore() {
      _classCallCheck(this, ExampleStore);

      _Store.call(this);
      this.state = { foo: 'bar' };
    }

    return ExampleStore;
  })(_Flux13.Store);

  var actionId = 'actionId';

  describe('#register()', function () {
    it('registers handler to respond to sync action', function () {
      var ExampleFlux = (function (_Flux) {
        _inherits(ExampleFlux, _Flux);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      var handler = _sinon2['default'].spy();
      store.register(actions.foo, handler);

      actions.foo('do');
      expect(handler.calledOnce).to.be['true'];
      expect(handler.firstCall.args[0]).to.equal('do');
      expect(handler.firstCall.args[1].body).to.equal('do');
      expect(handler.firstCall.args[2]).to.eql(store.state);

      actions.foo('re');
      expect(handler.calledTwice).to.be['true'];
      expect(handler.secondCall.args[0]).to.equal('re');
      expect(handler.secondCall.args[1].body).to.equal('re');
      expect(handler.secondCall.args[2]).to.eql(store.state);
    });

    it('registers handler to respond to async action success', function callee$2$0() {
      var ExampleFlux, flux, actions, store, handler;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleFlux = (function (_Flux2) {
              _inherits(ExampleFlux, _Flux2);

              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _Flux2.call(this);
                this.createActions('example', {
                  foo: function foo(something) {
                    return regeneratorRuntime.async(function foo$(context$6$0) {
                      while (1) switch (context$6$0.prev = context$6$0.next) {
                        case 0:
                          return context$6$0.abrupt('return', something);

                        case 1:
                        case 'end':
                          return context$6$0.stop();
                      }
                    }, null, this);
                  }
                });

                this.createStore('example', ExampleStore);
              }

              return ExampleFlux;
            })(_Flux13.Flux);

            flux = new ExampleFlux();
            actions = flux.getActions('example');
            store = flux.getStore('example');
            handler = _sinon2['default'].spy();

            store.register(actions.foo, handler);

            context$3$0.next = 8;
            return regeneratorRuntime.awrap(actions.foo('do'));

          case 8:
            expect(handler.calledOnce).to.be['true'];
            expect(handler.firstCall.args[0]).to.equal('do');
            expect(handler.firstCall.args[1].body).to.equal('do');
            expect(handler.firstCall.args[2]).to.eql(store.state);

            context$3$0.next = 14;
            return regeneratorRuntime.awrap(actions.foo('re'));

          case 14:
            expect(handler.calledTwice).to.be['true'];
            expect(handler.secondCall.args[0]).to.equal('re');
            expect(handler.secondCall.args[1].body).to.equal('re');
            expect(handler.secondCall.args[2]).to.eql(store.state);

          case 18:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.register.bind(store, null)).not.to['throw']();
    });
  });

  it('default state is null', function () {
    var store = new _Flux13.Store();
    expect(store.state).to.be['null'];
  });

  describe('#registerAsync()', function () {
    it('registers handlers for begin, success, and failure of async action', function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();
            ExampleActions = {
              getFoo: function getFoo(message) {
                var _success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                return regeneratorRuntime.async(function getFoo$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      if (_success) {
                        context$4$0.next = 2;
                        break;
                      }

                      throw error;

                    case 2:
                      return context$4$0.abrupt('return', message + ' success');

                    case 3:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              },

              getBar: function getBar(message) {
                return regeneratorRuntime.async(function getBar$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      return context$4$0.abrupt('return', message);

                    case 1:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              }
            };

            ExampleFlux = (function (_Flux3) {
              _inherits(ExampleFlux, _Flux3);

              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _Flux3.call(this);
                this.createActions('example', ExampleActions);
                this.createStore('example', ExampleStore);
              }

              return ExampleFlux;
            })(_Flux13.Flux);

            flux = new ExampleFlux();
            actions = flux.getActions('example');
            store = flux.getStore('example');
            handler = _sinon2['default'].spy();

            store.register(actions.getBar, handler);

            context$3$0.next = 10;
            return regeneratorRuntime.awrap(actions.getBar('bar'));

          case 10:
            expect(handler.calledOnce).to.be['true'];
            expect(handler.firstCall.args[0]).to.equal('bar');
            expect(handler.firstCall.args[1].body).to.equal('bar');
            expect(handler.firstCall.args[2]).to.eql(store.state);

            begin = _sinon2['default'].spy();
            success = _sinon2['default'].spy();
            failure = _sinon2['default'].spy();

            store.registerAsync(actions.getFoo, begin, success, failure);

            context$3$0.next = 20;
            return regeneratorRuntime.awrap(actions.getFoo('foo', true));

          case 20:
            expect(begin.calledOnce).to.be['true'];
            expect(begin.firstCall.args[0].async).to.equal('begin');
            expect(begin.firstCall.args[1]).to.eql(store.state);
            expect(success.calledOnce).to.be['true'];
            expect(success.firstCall.args[0]).to.equal('foo success');
            expect(success.firstCall.args[1].body).to.equal('foo success');
            expect(success.firstCall.args[2]).to.eql(store.state);
            expect(failure.called).to.be['false'];

            context$3$0.next = 30;
            return regeneratorRuntime.awrap(expect(actions.getFoo('bar', false)).to.be.rejected);

          case 30:

            expect(begin.calledTwice).to.be['true'];
            expect(success.calledOnce).to.be['true'];
            expect(failure.calledOnce).to.be['true'];
            expect(failure.firstCall.args[0]).to.equal(error);
            expect(failure.firstCall.args[1].error).to.equal(error);
            expect(failure.firstCall.args[2]).to.eql(store.state);

          case 36:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to['throw']();
    });
  });

  describe('#registerAll()', function () {
    it('registers handler to respond to all sync actions', function () {
      var ExampleFlux = (function (_Flux4) {
        _inherits(ExampleFlux, _Flux4);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux4.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      var handler = _sinon2['default'].spy();
      store.registerAll(handler);

      actions.foo('do');
      expect(handler.calledOnce).to.be['true'];
      expect(handler.firstCall.args[0]).to.equal('do');
      expect(handler.firstCall.args[1].body).to.equal('do');
      expect(handler.firstCall.args[2]).to.eql(store.state);

      actions.foo('re');
      expect(handler.calledTwice).to.be['true'];
      expect(handler.secondCall.args[0]).to.equal('re');
      expect(handler.secondCall.args[1].body).to.equal('re');
      expect(handler.secondCall.args[2]).to.eql(store.state);
    });

    it('registers handler to respond to all async action successes', function callee$2$0() {
      var ExampleFlux, flux, actions, store, handler;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleFlux = (function (_Flux5) {
              _inherits(ExampleFlux, _Flux5);

              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _Flux5.call(this);
                this.createActions('example', {
                  foo: function foo(something) {
                    return regeneratorRuntime.async(function foo$(context$6$0) {
                      while (1) switch (context$6$0.prev = context$6$0.next) {
                        case 0:
                          return context$6$0.abrupt('return', something);

                        case 1:
                        case 'end':
                          return context$6$0.stop();
                      }
                    }, null, this);
                  }
                });

                this.createStore('example', ExampleStore);
              }

              return ExampleFlux;
            })(_Flux13.Flux);

            flux = new ExampleFlux();
            actions = flux.getActions('example');
            store = flux.getStore('example');
            handler = _sinon2['default'].spy();

            store.registerAll(handler);

            context$3$0.next = 8;
            return regeneratorRuntime.awrap(actions.foo('do'));

          case 8:
            expect(handler.calledOnce).to.be['true'];
            expect(handler.firstCall.args[0]).to.equal('do');
            expect(handler.firstCall.args[1].body).to.equal('do');
            expect(handler.firstCall.args[2]).to.eql(store.state);

            context$3$0.next = 14;
            return regeneratorRuntime.awrap(actions.foo('re'));

          case 14:
            expect(handler.calledTwice).to.be['true'];
            expect(handler.secondCall.args[0]).to.equal('re');
            expect(handler.secondCall.args[1].body).to.equal('re');
            expect(handler.secondCall.args[2]).to.eql(store.state);

          case 18:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAll.bind(store, null)).not.to['throw']();
    });

    it('registers for all successful async actions', function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();
            ExampleActions = {
              getFoo: function getFoo(message) {
                var _success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                return regeneratorRuntime.async(function getFoo$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      if (_success) {
                        context$4$0.next = 2;
                        break;
                      }

                      throw error;

                    case 2:
                      return context$4$0.abrupt('return', message + ' success');

                    case 3:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              },

              getBar: function getBar(message) {
                var _success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                return regeneratorRuntime.async(function getBar$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      if (_success) {
                        context$4$0.next = 2;
                        break;
                      }

                      throw error;

                    case 2:
                      return context$4$0.abrupt('return', message + ' success');

                    case 3:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              }
            };

            ExampleFlux = (function (_Flux6) {
              _inherits(ExampleFlux, _Flux6);

              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _Flux6.call(this);
                this.createActions('example', ExampleActions);
                this.createStore('example', ExampleStore);
              }

              return ExampleFlux;
            })(_Flux13.Flux);

            flux = new ExampleFlux();
            actions = flux.getActions('example');
            store = flux.getStore('example');
            handler = _sinon2['default'].spy();

            store.registerAll(handler);

            context$3$0.next = 10;
            return regeneratorRuntime.awrap(actions.getBar('bar'));

          case 10:
            expect(handler.calledOnce).to.be['true'];
            expect(handler.firstCall.args[0]).to.equal('bar success');
            expect(handler.firstCall.args[1].body).to.equal('bar success');
            expect(handler.firstCall.args[2]).to.eql(store.state);

          case 14:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe('#registerAllAsync()', function () {
    it('registers generic handlers for begin, success, and failure of async action', function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();
            ExampleActions = {
              getFoo: function getFoo(message) {
                var _success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                return regeneratorRuntime.async(function getFoo$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      if (_success) {
                        context$4$0.next = 2;
                        break;
                      }

                      throw error;

                    case 2:
                      return context$4$0.abrupt('return', message + ' success');

                    case 3:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              },

              getBar: function getBar(message) {
                var _success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                return regeneratorRuntime.async(function getBar$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      if (_success) {
                        context$4$0.next = 2;
                        break;
                      }

                      throw error;

                    case 2:
                      return context$4$0.abrupt('return', message + ' success');

                    case 3:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, this);
              }
            };

            ExampleFlux = (function (_Flux7) {
              _inherits(ExampleFlux, _Flux7);

              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _Flux7.call(this);
                this.createActions('example', ExampleActions);
                this.createStore('example', ExampleStore);
              }

              return ExampleFlux;
            })(_Flux13.Flux);

            flux = new ExampleFlux();
            actions = flux.getActions('example');
            store = flux.getStore('example');
            begin = _sinon2['default'].spy();
            success = _sinon2['default'].spy();
            failure = _sinon2['default'].spy();

            store.registerAllAsync(begin, success, failure);

            context$3$0.next = 12;
            return regeneratorRuntime.awrap(actions.getFoo('foo', true));

          case 12:
            expect(begin.calledOnce).to.be['true'];
            expect(begin.firstCall.args[0].async).to.equal('begin');
            expect(begin.firstCall.args[1]).to.eql(store.state);
            expect(success.calledOnce).to.be['true'];
            expect(success.firstCall.args[0]).to.equal('foo success');
            expect(success.firstCall.args[1].body).to.equal('foo success');
            expect(success.firstCall.args[2]).to.eql(store.state);
            expect(failure.called).to.be['false'];

            context$3$0.next = 22;
            return regeneratorRuntime.awrap(expect(actions.getFoo('bar', false)).to.be.rejected);

          case 22:
            expect(begin.calledTwice).to.be['true'];
            expect(success.calledOnce).to.be['true'];
            expect(failure.calledOnce).to.be['true'];
            expect(failure.firstCall.args[0]).to.equal(error);
            expect(failure.firstCall.args[1].error).to.equal(error);
            expect(failure.firstCall.args[2]).to.eql(store.state);

            context$3$0.next = 30;
            return regeneratorRuntime.awrap(actions.getBar('foo', true));

          case 30:
            expect(begin.calledThrice).to.be['true'];
            expect(begin.thirdCall.args[0].async).to.equal('begin');
            expect(begin.thirdCall.args[1]).to.eql(store.state);

            expect(success.calledTwice).to.be['true'];
            expect(success.secondCall.args[1].body).to.equal('foo success');
            expect(success.secondCall.args[2]).to.eql(store.state);
            expect(failure.calledTwice).to.be['false'];

            context$3$0.next = 39;
            return regeneratorRuntime.awrap(expect(actions.getBar('bar', false)).to.be.rejected);

          case 39:
            expect(begin.callCount).to.equal(4);
            expect(success.calledTwice).to.be['true'];
            expect(failure.calledTwice).to.be['true'];
            expect(failure.secondCall.args[0]).to.equal(error);
            expect(failure.secondCall.args[1].error).to.equal(error);
            expect(failure.secondCall.args[2]).to.eql(store.state);

          case 45:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to['throw']();
    });
  });

  describe('#registerMatch', function () {
    it('registers handler that is called when matching function returns true for dispatcher payload', function () {
      var ExampleFlux = (function (_Flux8) {
        _inherits(ExampleFlux, _Flux8);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux8.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      var handler = _sinon2['default'].spy();
      store.registerMatch(function (payload) {
        return payload.body === 'match!';
      }, handler);

      actions.foo('match!');
      expect(handler.calledOnce).to.be['true'];
      expect(handler.firstCall.args[0].body).to.equal('match!');
      expect(handler.firstCall.args[1]).to.eql(store.state);

      actions.foo('not a match!');
      expect(handler.calledOnce).to.be['true'];
    });
  });

  describe('#waitFor()', function () {
    it('waits for other stores', function () {
      var flux = new _Flux13.Flux();
      var result = [];

      var store2 = undefined;

      var Store1 = (function (_Store2) {
        _inherits(Store1, _Store2);

        function Store1() {
          _classCallCheck(this, Store1);

          _Store2.call(this);

          this.register(actionId, function () {
            this.waitFor(store2);
            result.push(1);
          });
        }

        return Store1;
      })(_Flux13.Store);

      var Store2 = (function (_Store3) {
        _inherits(Store2, _Store3);

        function Store2() {
          _classCallCheck(this, Store2);

          _Store3.call(this);

          this.register(actionId, function () {
            result.push(2);
          });
        }

        return Store2;
      })(_Flux13.Store);

      flux.createStore('store1', Store1);
      flux.createStore('store2', Store2);

      store2 = flux.getStore('store2');

      flux.dispatch(actionId, 'foobar');

      expect(result).to.deep.equal([2, 1]);
    });
  });

  describe('#forceUpdate()', function () {
    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be['true'];
    });

    it('doesn\'t modify existing state', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.forceUpdate();
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });
  });

  describe('#setState()', function () {
    it('shallow merges old state with new state', function () {
      var store = new ExampleStore();

      store.setState({ bar: 'baz' });

      expect(store.state).to.deep.equal({
        foo: 'bar',
        bar: 'baz'
      });
    });

    it('supports transactional updates', function () {
      var store = new _Flux13.Store();
      store.state = { a: 1 };
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(2);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(3);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(4);
    });

    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.setState({ foo: 'bar' });

      expect(listener.calledOnce).to.be['true'];
    });

    it('batches multiple state updates within action handler', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.setState({ bar: 'baz' });

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ foo: 'bar', bar: 'baz', baz: 'foo' });
    });
  });

  describe('#replaceState()', function () {
    it('replaces old state with new state', function () {
      var store = new ExampleStore();

      store.replaceState({ bar: 'baz' });

      expect(store.state).to.deep.equal({
        bar: 'baz'
      });
    });

    it('batches multiple state updates within action handler', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });

    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.replaceState({ foo: 'bar' });

      expect(listener.calledOnce).to.be['true'];
    });
  });

  describe('.assignState', function () {
    it('can be overridden to enable custom state types', function () {
      var StringStore = (function (_Store4) {
        _inherits(StringStore, _Store4);

        function StringStore() {
          _classCallCheck(this, StringStore);

          _Store4.apply(this, arguments);
        }

        StringStore.assignState = function assignState(prevState, nextState) {
          return [prevState, nextState].filter(function (state) {
            return typeof state === 'string';
          }).join('');
        };

        return StringStore;
      })(_Flux13.Store);

      var store = new StringStore();

      expect(store.state).to.be['null'];
      store.setState('a');
      expect(store.state).to.equal('a');
      store.setState('b');
      expect(store.state).to.equal('ab');
      store.replaceState('xyz');
      expect(store.state).to.equal('xyz');
      store.setState('zyx');
      expect(store.state).to.equal('xyzzyx');
    });
  });

  describe('#getStateAsObject()', function () {
    it('returns the current state as an object', function () {
      var store = new _Flux13.Store();
      store.setState({ foo: 'bar', bar: 'baz' });
      expect(store.getStateAsObject()).to.deep.equal({ foo: 'bar', bar: 'baz' });
    });
  });

  describe('#forceUpdate()', function () {
    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be['true'];
    });

    it('doesn\'t modify existing state', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.forceUpdate();
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });
  });

  describe('action handlers', function () {

    it('can trigger a `setState` by returning an object', function () {
      var ExampleFlux = (function (_Flux9) {
        _inherits(ExampleFlux, _Flux9);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux9.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      store.registerAll(function (body, payload, prevState) {
        return {
          foo: body + prevState.foo
        };
      });

      actions.foo('foo');
      expect(store.state.foo).to.equal('foobar');
    });

    it('do not trigger a `setState` when not returning an object', function () {
      var ExampleFlux = (function (_Flux10) {
        _inherits(ExampleFlux, _Flux10);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux10.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      var invalid = ['testing', [1, 2, 3], /test/, new Date(), true, false, null];

      invalid.forEach(function (invalidReturn) {
        store.registerAll(function (body, payload, prevState) {
          return invalidReturn;
        });
      });

      actions.foo('foo');
      expect(store.state.foo).to.equal('bar');
    });

    it('receive always the latest state object', function () {
      var ExampleFlux = (function (_Flux11) {
        _inherits(ExampleFlux, _Flux11);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux11.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      store.registerAll(function (body, payload, prevState) {
        return {
          foo: body + prevState.foo
        };
      });

      store.registerAll(function (body, payload, prevState) {
        expect(prevState.foo).to.equal('foobar');
        return {
          foo: 'test' + prevState.foo
        };
      });

      actions.foo('foo');
      expect(store.state.foo).to.equal('testfoobar');
    });

    it('`setState` calls are additive', function () {
      var ExampleFlux = (function (_Flux12) {
        _inherits(ExampleFlux, _Flux12);

        function ExampleFlux() {
          _classCallCheck(this, ExampleFlux);

          _Flux12.call(this);
          this.createActions('example', {
            foo: function foo(something) {
              return something;
            }
          });

          this.createStore('example', ExampleStore);
        }

        return ExampleFlux;
      })(_Flux13.Flux);

      var flux = new ExampleFlux();
      var actions = flux.getActions('example');
      var store = flux.getStore('example');

      store.registerAll(function (body, payload, prevState) {
        return {
          foo: prevState.foo + body
        };
      });

      store.registerAll(function (body, payload, prevState) {
        return {
          foo: prevState.foo + body
        };
      });

      store.registerAll(function (body, payload, prevState) {
        return {
          foo: prevState.foo + 42
        };
      });

      actions.foo('foo');
      expect(store.state.foo).to.equal('barfoofoo42');
    });
  });
});