var passport = require("passport");
var xtend = require("xtend");

module.exports = function() {
  return new Auth();
}

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
  }
}

/**
 * Extends the User schema with the given fields.
 *
 * @param {object} fields - Fields in Mongoose schema format
 */
Auth.prototype.extendUser = function extendUser(fields) {
  if (fields.hasOwnProperty("username") || props.hasOwnProperty("password")) {
    throw new Error("Cannot redefine username or password user fields!");
  }
  this._userSchema = xtend(fields, this._userSchema);
}

/**
 * Creates the user model from the schema. Only call this once. Internal use only.
 */
Auth.prototype._createUserModel = function _createUserModel(fields) {
  return mongoose.model("User", this._userSchema);
}
