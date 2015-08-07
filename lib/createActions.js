'use strict';

exports.__esModule = true;
exports['default'] = createActions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uniqueid = require('uniqueid');

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