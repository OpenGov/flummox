'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Flux = require('../../Flux');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _react = require('../react');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var TestUtils = _reactAddons2['default'].addons.TestUtils;

describe('FluxComponent', function () {

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

  it('gets Flux property from either props or context', function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var ContextComponent = _addContext2['default'](_react.FluxComponent, { flux: flux }, { flux: _reactAddons2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, _react.FluxComponent);

    propsComponent = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('allows for FluxComponents through the tree via context', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var TopView = (function (_React$Component) {
      _inherits(TopView, _React$Component);

      function TopView() {
        _classCallCheck(this, TopView);

        _React$Component.apply(this, arguments);
      }

      TopView.prototype.render = function render() {
        return _reactAddons2['default'].createElement(
          _react.FluxComponent,
          { flux: flux },
          _reactAddons2['default'].createElement(SubView, null)
        );
      };

      return TopView;
    })(_reactAddons2['default'].Component);

    var SubView = (function (_React$Component2) {
      _inherits(SubView, _React$Component2);

      function SubView() {
        _classCallCheck(this, SubView);

        _React$Component2.apply(this, arguments);
      }

      SubView.prototype.render = function render() {
        return _reactAddons2['default'].createElement(SubSubView, null);
      };

      return SubView;
    })(_reactAddons2['default'].Component);

    var SubSubView = (function (_React$Component3) {
      _inherits(SubSubView, _React$Component3);

      function SubSubView() {
        _classCallCheck(this, SubSubView);

        _React$Component3.apply(this, arguments);
      }

      SubSubView.prototype.render = function render() {
        return _reactAddons2['default'].createElement(
          _react.FluxComponent,
          { stores: 'test' },
          _reactAddons2['default'].createElement('div', null)
        );
      };

      return SubSubView;
    })(_reactAddons2['default'].Component);

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(TopView, null));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.props.something).to.equal('something good');
  });

  it('passes `stores` prop to reactComponentMethod connectToStores()', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, { flux: flux, stores: 'test' }));

    actions.getSomething('something good');
    expect(component.state.storeState.something).to.deep.equal('something good');
    actions.getSomething('something else');
    expect(component.state.storeState.something).to.deep.equal('something else');
  });

  it('passes stateGetter prop to reactComponentMethod connectToStores()', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');
    var stateGetter = _sinon2['default'].stub().returns({ fiz: 'bin' });

    var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, { flux: flux, stores: 'test', stateGetter: stateGetter }));

    expect(component.state.storeState.fiz).to.equal('bin');
  });

  it('passes injectActions prop to reactComponentMethod collectActions()', function () {
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

    var component = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, {
      flux: flux,
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
      },
      render: function (storeState, actions) {
        return _reactAddons2['default'].createElement('div', actions);
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(component, 'div');

    expect(div.props['do']()).to.equal('re');
    expect(div.props.fa()).to.equal('so');
  });

  it('injects children with props corresponding to component state', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(
      _react.FluxComponent,
      { flux: flux, stores: 'test' },
      _reactAddons2['default'].createElement('div', null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.props.something).to.equal('something good');
    actions.getSomething('something else');
    expect(div.props.something).to.equal('something else');
  });

  it('injects children with any extra props', function () {
    var flux = new Flux();
    var stateGetter = function stateGetter() {};
    var actionGetter = function actionGetter() {};

    // Pass all possible PropTypes to ensure only extra props
    // are injected.
    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(
      _react.FluxComponent,
      {
        flux: flux,
        stores: 'test',
        stateGetter: stateGetter,
        actionGetter: actionGetter,
        extraProp: 'hello'
      },
      _reactAddons2['default'].createElement('div', null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
    expect(div.props.extraProp).to.equal('hello');
    expect(Object.keys(div.props)).to.deep.equal(['extraProp']);
  });

  it('wraps multiple children in span tag', function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(
      _react.FluxComponent,
      { flux: flux },
      _reactAddons2['default'].createElement('div', null),
      _reactAddons2['default'].createElement('div', null)
    ));

    var wrapper = TestUtils.findRenderedDOMComponentWithTag(tree, 'span');
    var divs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div');

    expect(divs.length).to.equal(2);
  });

  it('does not wrap single child in span tag', function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(
      _react.FluxComponent,
      { flux: flux },
      _reactAddons2['default'].createElement('div', null)
    ));

    expect(TestUtils.findRenderedDOMComponentWithTag.bind(TestUtils, tree, 'span')).to['throw']('Did not find exactly one match for tag:span');
  });

  it('allows for nested FluxComponents', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(
      _react.FluxComponent,
      { flux: flux, stores: 'test' },
      _reactAddons2['default'].createElement(
        _react.FluxComponent,
        null,
        _reactAddons2['default'].createElement('div', null)
      )
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.props.something).to.equal('something good');
    actions.getSomething('something else');
    expect(div.props.something).to.equal('something else');
  });

  it('uses `render` prop for custom rendering, if it exists', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, {
      flux: flux,
      stores: 'test',
      render: function (props) {
        return _reactAddons2['default'].createElement('div', { something: props.something });
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.props.something).to.equal('something good');
    actions.getSomething('something else');
    expect(div.props.something).to.equal('something else');
  });

  it('passes all additional props as third parameter to `render`', function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_react.FluxComponent, {
      flux: flux,
      stores: 'test',
      some: 'prop',
      another: 'one',
      render: function (props, actions, originalProps) {
        return _reactAddons2['default'].createElement('div', _extends({}, originalProps, { original: originalProps }));
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
    expect(div.props.some).to.equal('prop');
    expect(div.props.another).to.equal('one');
    expect(div.props.original).to.eql({
      some: 'prop',
      another: 'one'
    });
  });

  it('updates with render-time computed values in state getters on componentWillReceiveProps()', function () {
    var flux = new Flux();

    var Owner = (function (_React$Component4) {
      _inherits(Owner, _React$Component4);

      function Owner(props) {
        _classCallCheck(this, Owner);

        _React$Component4.call(this, props);

        this.state = {
          foo: 'bar'
        };
      }

      Owner.prototype.render = function render() {
        var _this = this;

        return _reactAddons2['default'].createElement(_react.FluxComponent, {
          flux: flux,
          stores: {
            test: function test(store) {
              return {
                yay: _this.state.foo
              };
            }
          },
          render: function (storeState) {
            return _reactAddons2['default'].createElement('div', storeState);
          }
        });
      };

      return Owner;
    })(_reactAddons2['default'].Component);

    var owner = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(Owner, null));
    var div = TestUtils.findRenderedDOMComponentWithTag(owner, 'div');

    expect(div.props.yay).to.equal('bar');
    owner.setState({ foo: 'baz' });
    expect(div.props.yay).to.equal('baz');
  });
});