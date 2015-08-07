'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('../react');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _Flux = require('../../Flux');

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var PropTypes = _reactAddons2['default'].PropTypes;
var TestUtils = _reactAddons2['default'].addons.TestUtils;

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
  }

  return Flux;
})(_Flux.Flummox);

describe('connect (HoC)', function () {
  it('gets Flux from either props or context', function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var BaseComponent = (function (_React$Component) {
      _inherits(BaseComponent, _React$Component);

      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        _React$Component.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', null);
      };

      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var ConnectedComponent = _react.connect({
      stores: 'test'
    })(BaseComponent);

    var ContextComponent = _addContext2['default'](ConnectedComponent, { flux: flux }, { flux: _reactAddons2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ConnectedComponent);

    propsComponent = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ConnectedComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('passes store state as props', function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component2) {
      _inherits(BaseComponent, _React$Component2);

      function BaseComponent() {
        _classCallCheck(this, _BaseComponent);

        _React$Component2.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', this.props);
      };

      var _BaseComponent = BaseComponent;
      BaseComponent = _react.connect({
        stores: 'test'
      })(BaseComponent) || BaseComponent;
      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(BaseComponent, { flux: flux, foo: 'bar', bar: 'baz' }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    expect(div.props.foo).to.equal('bar');
    expect(div.props.bar).to.equal('baz');
  });

  it('passes actions as props', function () {
    var Flux = (function (_Flummox2) {
      _inherits(Flux, _Flummox2);

      function Flux() {
        _classCallCheck(this, Flux);

        _Flummox2.call(this);

        this.createActions('A', {
          'do': function _do() {
            return 're';
          },

          re: function re() {
            return 'mi';
          }
        });

        this.createActions('B', {
          mi: function mi() {
            return 'fa';
          },

          fa: function fa() {
            return 'so';
          }
        });
      }

      return Flux;
    })(_Flux.Flummox);

    var flux = new Flux();

    var BaseComponent = (function (_React$Component3) {
      _inherits(BaseComponent, _React$Component3);

      function BaseComponent() {
        _classCallCheck(this, _BaseComponent2);

        _React$Component3.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', this.props);
      };

      var _BaseComponent2 = BaseComponent;
      BaseComponent = _react.connect({
        actions: {
          A: function A(actions) {
            return {
              'do': actions['do']
            };
          },

          B: function B(actions) {
            return {
              fa: actions.fa
            };
          }
        }
      })(BaseComponent) || BaseComponent;
      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(BaseComponent, { flux: flux }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    expect(div.props['do']()).to.equal('re');
    expect(div.props.fa()).to.equal('so');
  });

  it('passes all actions as props, when passing a string', function () {
    var Flux = (function (_Flummox3) {
      _inherits(Flux, _Flummox3);

      function Flux() {
        _classCallCheck(this, Flux);

        _Flummox3.call(this);

        this.createActions('A', {
          'do': function _do() {
            return 're';
          },

          re: function re() {
            return 'mi';
          }
        });

        this.createActions('B', {
          mi: function mi() {
            return 'fa';
          },

          fa: function fa() {
            return 'so';
          }
        });
      }

      return Flux;
    })(_Flux.Flummox);

    var flux = new Flux();

    var BaseComponent = (function (_React$Component4) {
      _inherits(BaseComponent, _React$Component4);

      function BaseComponent() {
        _classCallCheck(this, _BaseComponent3);

        _React$Component4.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', this.props);
      };

      var _BaseComponent3 = BaseComponent;
      BaseComponent = _react.connect({
        actions: 'A'
      })(BaseComponent) || BaseComponent;
      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(BaseComponent, { flux: flux }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    expect(div.props['do']()).to.equal('re');
    expect(div.props.re()).to.equal('mi');
  });

  it('passes all actions as props, when passing an array', function () {
    var Flux = (function (_Flummox4) {
      _inherits(Flux, _Flummox4);

      function Flux() {
        _classCallCheck(this, Flux);

        _Flummox4.call(this);

        this.createActions('A', {
          'do': function _do() {
            return 're';
          },

          re: function re() {
            return 'mi';
          }
        });

        this.createActions('B', {
          mi: function mi() {
            return 'fa';
          },

          fa: function fa() {
            return 'so';
          }
        });
      }

      return Flux;
    })(_Flux.Flummox);

    var flux = new Flux();

    var BaseComponent = (function (_React$Component5) {
      _inherits(BaseComponent, _React$Component5);

      function BaseComponent() {
        _classCallCheck(this, _BaseComponent4);

        _React$Component5.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', this.props);
      };

      var _BaseComponent4 = BaseComponent;
      BaseComponent = _react.connect({
        actions: ['A', 'B']
      })(BaseComponent) || BaseComponent;
      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(BaseComponent, { flux: flux }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    expect(div.props['do']()).to.equal('re');
    expect(div.props.re()).to.equal('mi');
    expect(div.props.mi()).to.equal('fa');
    expect(div.props.fa()).to.equal('so');
  });

  it('syncs with store after state change', function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component6) {
      _inherits(BaseComponent, _React$Component6);

      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        _React$Component6.apply(this, arguments);
      }

      BaseComponent.prototype.render = function render() {
        return _reactAddons2['default'].createElement('div', null);
      };

      return BaseComponent;
    })(_reactAddons2['default'].Component);

    var ConnectedComponent = _react.connect({
      stores: 'test'
    })(BaseComponent);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ConnectedComponent, { flux: flux }));

    var component = TestUtils.findRenderedComponentWithType(tree, BaseComponent);

    var getSomething = flux.getActions('test').getSomething;

    expect(component.props.something).to.be['null'];

    getSomething('do');

    expect(component.props.something).to.equal('do');

    getSomething('re');

    expect(component.props.something).to.equal('re');
  });
});