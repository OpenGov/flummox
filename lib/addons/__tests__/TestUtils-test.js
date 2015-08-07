'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _TestUtils = require('../TestUtils');

var TestUtils = _interopRequireWildcard(_TestUtils);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

describe('TestUtils', function () {
  describe('#simulateAction', function () {
    it('calls the stores handler', function () {
      var store = mockStore();
      var actionFunc = function actionFunc() {};
      actionFunc._id = 'actionFunc';

      TestUtils.simulateAction(store, 'foo', 'foo body');
      TestUtils.simulateAction(store, actionFunc, 'actionFunc body');

      expect(store.handler.calledTwice).to.be['true'];

      expect(store.handler.getCall(0).args[0]).to.deep.equal({
        actionId: 'foo',
        body: 'foo body'
      });

      expect(store.handler.getCall(1).args[0]).to.deep.equal({
        actionId: 'actionFunc',
        body: 'actionFunc body'
      });
    });
  });

  describe('#simulateActionAsync', function () {
    it('it handles async begin', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'begin');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'begin'
      });
    });

    it('it handles async begin w/ action args', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'begin', 'arg1', 'arg2');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'begin',
        actionArgs: ['arg1', 'arg2']
      });
    });

    it('it handles async success', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'success', { foo: 'bar' });

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'success',
        body: {
          foo: 'bar'
        }
      });
    });

    it('it handles async failure', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'failure', 'error message');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'failure',
        error: 'error message'
      });
    });

    it('it throws error with invalid asyncAction', function () {
      var store = mockStore();
      var simulate = function simulate() {
        return TestUtils.simulateActionAsync(store, 'foo', 'fizbin');
      };

      expect(simulate).to['throw']('asyncAction must be one of: begin, success or failure');
    });
  });
});

function mockStore() {
  return {
    handler: _sinon2['default'].spy()
  };
}