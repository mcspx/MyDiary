'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _entryController = require('../../controller/entryController');

var _entryController2 = _interopRequireDefault(_entryController);

var _index = require('../../middleware/validation/index');

var _index2 = _interopRequireDefault(_index);

var _auth = require('../../middleware/authorization/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var entry = new _entryController2.default();

// get all entries
router.get('/', _auth2.default.isValid, function (req, res) {
  entry.getAll(req, res);
});

// add a new entry
router.post('/', [_auth2.default.isValid, (0, _expressValidation2.default)(_index2.default.Entry.create)], function (req, res, next) {
  entry.create(req, res, next);
});

// get entry by id
router.get('/:id', [_auth2.default.isValid, (0, _expressValidation2.default)(_index2.default.Entry.getById)], function (req, res, next) {
  entry.getById(req, res, next);
});

// update entry
router.put('/:id', [_auth2.default.isValid, (0, _expressValidation2.default)(_index2.default.Entry.update)], function (req, res, next) {
  entry.update(req, res, next);
});

// delete entry
router.delete('/:id', [_auth2.default.isValid, (0, _expressValidation2.default)(_index2.default.Entry.delete)], function (req, res) {
  entry.delete(req, res);
});

module.exports = router;