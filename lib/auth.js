"use strict";

var mongoose = require("mongoose");
var passport = require("passport");
var xtend = require("xtend");

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
Auth.prototype.setup = function setup(app, root) {
  var User = mongoose.model("User", new mongoose.Schema(this._userSchema));

  app.post(root + "/login", passport.authenticate("local", function(req, res) {
    res.json({ username: req.user.username });
  }));

  app.get(root + "/logout", function (req, res) {
    req.logout();
    res.send(300);
  });
}
