var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/test1', function(req, res, next) {
  res.send('respond with a resource 1');
});

router.get('/test2', function(req, res, next) {
  res.send('respond with a resource 2');
});

module.exports = router;
