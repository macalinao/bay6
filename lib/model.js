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
