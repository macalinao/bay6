"use strict";

module.exports = Model;

/**
 * Represents a model.
 *
 * @param {string} name - The name of the model
 * @param {Schema} schema - The mongoose schema
 * @param {object} opts - Model options
 */
function Model(name, schema, opts) {
  this.name = name;
  this.schema = schema;
  this.opts = opts;
}

/**
 * Adds a limit to the number of returned objects.
 *
 * @param amt - Maximum returned object count
 */
Model.prototype.limit = function(amt) {
  this.opts.middleware = this.opts.middleware || [];
  this.opts.middleware.push(function(req, res, next) {
    req.query.limit = Math.min(req.query.limit || 0, amt);
    next();
  });
  return this;
};
