const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !mobile) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (mobile.length = 10) {
    errors.push({ msg: 'mobile no must be at least 10 digits' });
  }

  

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      mobile,
      password,
      password2
    });

  } else {
	  	User.findOne({ email: email }).then(user => {
	    if (user) {
	        errors.push({ msg: 'Email already exists' });
	        res.render('register', {
	          errors,
	          name,
	          email,
	          mobile,
	          password,
	          password2
	        });
	    } else {
	        const newUser = new User({
	          name,
	          email,
	          mobile,
	          password
	        });
	       
		  	bcrypt.genSalt(10, (err, salt) => {
	          bcrypt.hash(newUser.password, salt, (err, hash) => {
	            if (err) throw err;
	            newUser.password = hash;
	            newUser
	              .save()
	              .then(user => {
	                req.flash(
	                  'success_msg',
	                  'You are now registered and can log in'
	                );
	                res.redirect('/users/login');
	              })
	              .catch(err => console.log(err));
	          });
	        });
      	}
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;










