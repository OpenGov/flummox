'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Flux = require('../Flux');

var _createActions = require('../createActions');

var _createActions2 = _interopRequireDefault(_createActions);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function noop() {}

describe('createActions', function () {

  it('returns a mapped object', function () {
    var actions = _createActions2['default'](noop, { a: 'a', b: 'b' });
    expect(Object.keys(actions)).to.deep.equal(['a', 'b']);
  });

  it('passes non-functions as-is', function () {
    var actions = _createActions2['default'](noop, { string: 'string', number: 42 });
    expect(actions).to.deep.equal({ string: 'string', number: 42 });
  });

  it('gives functions a unique id', function () {
    var actions = _createActions2['default'](noop, { a: noop, b: noop });
    expect(actions.a._id).to.be.a('string');
    expect(actions.b._id).to.be.a('string');
    expect(actions.a._id).to.not.equal(actions.b._id);
  });

  it('binds functions to original object', function () {
    var actions = _createActions2['default'](function (id, actionCreator) {
      return actionCreator();
    }, {
      foo: 'bar',
      getFoo: function getFoo() {
        return this.foo;
      }
    });
    var getFoo = actions.getFoo;
    expect(getFoo()).to.equal('bar');
  });

  it('wraps functions in `perform()`', function () {
    var spy = _sinon2['default'].spy();
    var originalActions = {
      getFoo: function getFoo() {
        return 'bar';
      }
    };
    var actions = _createActions2['default'](spy, originalActions);
    actions.getFoo('baz');
    expect(spy.calledOnce).to.be['true'];
    expect(spy.firstCall.args[1]()).to.equal('bar');
  });
});