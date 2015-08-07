'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Flux = require('../../Flux');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

// fluxMixin is no more, but we still need these tests
// Need to migrate/refactor these tests so that they're more general
// For now, we're just inlining an implementation of fluxMixin here

var _reactComponentMethods = require('../reactComponentMethods');

var _reactComponentMethods2 = _interopRequireDefault(_reactComponentMethods);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var PropTypes = _reactAddons2['default'].PropTypes;
var TestUtils = _reactAddons2['default'].addons.TestUtils;

var _createReactComponentMethods = _reactComponentMethods2['default'](_reactAddons2['default']);

var instanceMethods = _createReactComponentMethods.instanceMethods;
var staticProperties = _createReactComponentMethods.staticProperties;

var fluxMixin = function fluxMixin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _extends({
    getInitialState: function getInitialState() {
      this.initialize();
      return {
        storeState: this.connectToStores.apply(this, args)
      };
    }
  }, instanceMethods, staticProperties);
};

describe('fluxMixin', function () {

  var TestActions = {
    getSomething: function getSomething(something) {
      return something;
    }
  };

  var TestStore = (function (_Store) {
    _inherits(TestStore, _Store);

    function TestStore(flux) {
      _classCallCheck(this, TestStore);

      _Store.call(this);

      var testActions = flux.getActions('test');
      this.register(testActions.getSomething, this.handleGetSomething);

      this.state = {
        something: null
      };
    }

    TestStore.prototype.handleGetSomething = function handleGetSomething(something, payload, state) {
      return { something: something };
    };

    return TestStore;
  })(_Flux.Store);

  var Flux = (function (_Flummox) {
    _inherits(Flux, _Flummox);

    function Flux() {
      _classCallCheck(this, Flux);

      _Flummox.call(this);

      this.createActions('test', TestActions);
      this.createStore('test', TestStore, this);
      this.createStore('test2', TestStore, this);
    }

    return Flux;
  })(_Flux.Flummox);

  var ComponentWithFluxMixin = _reactAddons2['default'].createClass({
    displayName: 'ComponentWithFluxMixin',

    mixins: [fluxMixin()],

    render: function render() {
      return null;
    }
  });

  it('gets flux from either props or context', function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var ContextComponent = _addContext2['default'](ComponentWithFluxMixin, { flux: flux }, { flux: _reactAddons2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ComponentWithFluxMixin);

    propsComponent = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('exposes flux as context', function () {
    var flux = new Flux();

    var ChildComponent = _reactAddons2['default'].createClass({
      displayName: 'ChildComponent',

      contextTypes: {
        flux: PropTypes.instanceOf(_Flux.Flummox)
      },

      render: function render() {
        return _reactAddons2['default'].createElement('div', null);
      }
    });

    var Component = _reactAddons2['default'].createClass({
      displayName: 'Component',

      mixins: [fluxMixin()],

      render: function render() {
        return _reactAddons2['default'].createElement(
          'div',
          null,
          _reactAddons2['default'].createElement(ChildComponent, { key: 'test' })
        );
      }
    });

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(Component, { flux: flux }));

    var childComponent = TestUtils.findRenderedComponentWithType(tree, ChildComponent);

    expect(childComponent.context.flux).to.equal(flux);
  });

  it('throws error if neither props or context is set', function () {
    var flux = new Flux();

    expect(TestUtils.renderIntoDocument.bind(null, _reactAddons2['default'].createElement(ComponentWithFluxMixin, null))).to['throw']('Could not find Flux instance. Ensure that your component ' + 'has either `this.context.flux` or `this.props.flux`.');
  });

  it('ignores change event after unmounted', function () {
    var flux = new Flux();
    flux.getActions('test').getSomething('foo');

    var getterMap = {
      test: function test(store) {
        return { something: store.state.something };
      }
    };
    var Component = _reactAddons2['default'].createClass({
      displayName: 'Component',

      mixins: [fluxMixin(getterMap)],

      render: function render() {
        return null;
      }
    });

    var container = document.createElement('div');
    var component = _reactAddons2['default'].render(_reactAddons2['default'].createElement(Component, { flux: flux }), container);
    var listener = flux.getStore('test').listeners('change')[0];

    _reactAddons2['default'].unmountComponentAtNode(container);

    flux.getActions('test').getSomething('bar');
    listener();

    expect(component.state.storeState.something).to.equal('foo');
  });

  it('uses #connectToStores() to get initial state', function () {
    var flux = new Flux();

    flux.getActions('test').getSomething('foobar');

    var getterMap = {
      test: function test(store) {
        return {
          something: store.state.something,
          custom: true
        };
      }
    };

    var mixin = fluxMixin(getterMap);

    var connectToStores = _sinon2['default'].spy(mixin, 'connectToStores');

    var Component = _reactAddons2['default'].createClass({
      displayName: 'Component',

      mixins: [mixin],

      getInitialState: function getInitialState() {
        return {
          foobar: 'baz'
        };
      },

      render: function render() {
        return null;
      }
    });

    var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(Component, { key: 'test', flux: flux }));

    expect(connectToStores.calledOnce).to.be['true'];
    expect(connectToStores.firstCall.args[0]).to.equal(getterMap);

    expect(flux.getStore('test').listeners('change')).to.have.length(1);

    expect(component.state).to.deep.equal({
      foobar: 'baz',
      storeState: {
        something: 'foobar',
        custom: true
      }
    });
  });

  describe('#connectToStores', function () {

    it('returns initial state', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      var initialState = component.connectToStores('test');

      expect(initialState).to.deep.equal({
        something: null
      });
    });

    it('merges store state with component state on change', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test');
      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        storeState: {
          something: 'foobar'
        },
        otherThing: 'barbaz'
      });
    });

    it('uses custom state getter, if given', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux, bar: 'baz' }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test', function (store, props) {
        return {
          something: store.state.something,
          barbaz: 'bar' + props.bar
        };
      });

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        otherThing: 'barbaz',
        storeState: {
          something: 'foobar',
          barbaz: 'barbaz'
        }
      });
    });

    it('syncs with store after prop change', function () {
      var flux = new Flux();

      var Component = _reactAddons2['default'].createClass({
        displayName: 'Component',

        mixins: [fluxMixin({
          test: function test(store, props) {
            return {
              foo: 'foo is ' + props.foo
            };
          }
        })],

        render: function render() {
          return null;
        }
      });

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(Component, { key: 'test', flux: flux, foo: 'bar' }));

      expect(component.state.storeState.foo).to.equal('foo is bar');

      component.setProps({ foo: 'baz' });

      expect(component.state.storeState.foo).to.equal('foo is baz');
    });

    it('accepts object of keys to state getters', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores({
        test: function test(store) {
          return {
            something: store.state.something,
            custom: true
          };
        }
      });

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        otherThing: 'barbaz',
        storeState: {
          something: 'foobar',
          custom: true
        }
      });
    });

    it('calls default state getter once with array of stores', function () {
      var flux = new Flux();

      flux.getStore('test2').setState({ otherThing: 'barbaz' });

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.connectToStores(['test', 'test2']);

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        storeState: {
          something: 'foobar',
          otherThing: 'barbaz'
        }
      });
    });

    it('calls custom state getter once with array of stores', function () {
      var flux = new Flux();
      var testStore = flux.getStore('test');
      var test2Store = flux.getStore('test2');

      testStore._testId = 'test';
      test2Store._testId = 'test2';

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      var stateGetter = _sinon2['default'].stub().returns({ foo: 'bar' });
      var state = component.connectToStores(['test', 'test2'], stateGetter);

      expect(stateGetter.calledOnce).to.be['true'];
      // Use _testId as unique identifier on store.
      expect(stateGetter.firstCall.args[0][0]._testId).to.equal('test');
      expect(stateGetter.firstCall.args[0][1]._testId).to.equal('test2');

      expect(state).to.deep.equal({
        foo: 'bar'
      });
    });

    it('uses default getter if null is passed as getter', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test', null);

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        storeState: {
          something: 'foobar'
        },
        otherThing: 'barbaz'
      });
    });

    it('removes listener before unmounting', function () {
      var flux = new Flux();
      var div = document.createElement('div');

      var component = _reactAddons2['default'].render(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { flux: flux }), div);

      var store = flux.getStore('test');
      component.connectToStores('test');

      expect(store.listeners('change').length).to.equal(1);
      _reactAddons2['default'].unmountComponentAtNode(div);
      expect(store.listeners('change').length).to.equal(0);
    });
  });

  describe('#getStoreState', function () {
    it('gets combined state of connected stores', function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.connectToStores({
        test: function test(store) {
          return {
            foo: 'bar'
          };
        },
        test2: function test2(store) {
          return {
            bar: 'baz'
          };
        }
      });

      component.setState({ baz: 'foo' });

      expect(component.getStoreState()).to.deep.equal({
        foo: 'bar',
        bar: 'baz'
      });
    });
  });
});