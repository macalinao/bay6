"use strict";

module.exports = Model;

/**
 * Represents a model.
 *
 * @param {mongoose.Model} model - The mongoose model of this model.
 * @param {object} opts - Model options
 */
function Model(model, opts) {
  this.model = model;
  this.opts = opts;
}
