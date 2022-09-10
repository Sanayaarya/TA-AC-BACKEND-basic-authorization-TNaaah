var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  Blog.find({}, (err, blog) => {
    if (err) return next(err);
    res.render('index', { blog: blog });
  });
});

router.get('/blogs/protected', auth.loggedInUser, (req, res) => {
  res.send('Protected Resource');
});

module.exports = router;