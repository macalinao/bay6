"use strict";

var mongoose = require("mongoose");
var passport = require("passport");
var xtend = require("xtend");

var makeUserSchema = require("./user");

// Auth strategies
var LocalStrategy = require("passport-local").Strategy;

module.exports = Auth;

function Auth() {
  // These fields are required for the user schema
  this._userSchema = {
    username: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      }
    },
    password: {
      type: String,
      required: true
    }
  };

  // Export to allow people to use their own auth stuff
  this.passport = passport;
}

/**
 * Extends the User schema with the given fields.
 *
 * @param {object} fields - Fields in Mongoose schema format
 */
Auth.prototype.extendUser = function extendUser(fields) {
  if (fields.hasOwnProperty("username") || fields.hasOwnProperty("password")) {
    throw new Error("Cannot redefine username or password user fields!");
  }
  this._userSchema = xtend(fields, this._userSchema);
};

/**
 * Sets up the auth
 */
Auth.prototype.setup = function setup(bay6, root) {
  var UserSchema = makeUserSchema(this._userSchema);
  bay6.model("User", UserSchema);

  var express = bay6.express;
  // Local auth
  passport.use(new LocalStrategy(function(username, password, done) {
    var User = bay6.mongoose.model("User");
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    });
  }));

  express.post(root + "/login", passport.authenticate("local", function(req, res) {
    res.json({ username: req.user.username });
  }));

  express.get(root + "/logout", function (req, res) {
    req.logout();
    res.send(300);
  });

  // Profile -- user info
  express.get(root + "/profile", function(req, res) {
    if (!req.user) {
      res.send(401);
    }
    var show = req.user.toObject();
    delete show.password;
    res.json(show);
  });
};
