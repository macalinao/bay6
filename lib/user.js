"use strict";

var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

module.exports = function(schema) {
  var UserSchema = new mongoose.Schema(schema);

  UserSchema.pre("save", preSavePassword);
  UserSchema.methods.validPassword = methodValidPassword;

  return UserSchema;
};

var preSavePassword = function preSavePassword(next) {
  var user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
};

/**
 * Checks if the given password is valid for this user.
 */
var methodValidPassword = function methodValidPassword(password) {
  return bcrypt.compareSync(password, this.password);
};
