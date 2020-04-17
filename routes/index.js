var express = require('express');
var router = express.Router();

var indexController = require('../controller/indexController');

router.get('/', indexController.index);
router.get('/upload', indexController.upload);
router.post('/histogram', indexController.histogram);
router.get('/histogram', indexController.displayHistogram);
router.post('/report', indexController.report);
router.get('/report', indexController.displayReport);
router.get('/report/student', indexController.studentReport);

module.exports = router;
