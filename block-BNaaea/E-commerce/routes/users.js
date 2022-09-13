var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middleware/auth');

// register user
router.get('/register/new', (req, res, next) => {
  let user = req.user;
  res.render('register', { user });
});

router.post('/register/new', (req, res, next) => {
  User.create(req.body, (err, register) => {
    console.log(err, register);
    if (err) return next(err);
    res.redirect('/users/userLogin');
  });
});

// login

router.get('/userLogin', (req, res, next) => {
  let user = req.user;
  console.log(req.session);
  let error = req.flash('error')[0];
  res.render('userLogin', { error, user });
});

router.post('/userLogin', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email and Password is required');
    return res.redirect('/users/userLogin');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Email and Password is inCorrect');
      return res.redirect('/users/userLogin');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/users/userLogin');
      } else {
        console.log(req.session);
        req.session.userId = user.id;
        req.session.isAdmin = user.isAdmin;
        return res.redirect('/dashboard');
      }
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/home');
});

module.exports = router;