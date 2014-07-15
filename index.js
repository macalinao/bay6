var mongoose = require("mongoose");
var restify = require("express-restify-mongoose");
var xtend = require("xtend");

var Model = require("libs/model");

module.exports = function() {
  return new Bay6();
}

function Bay6() {
  this._models = [];

  this.options = {
    prefix: "/api",
    version: ""
  }
}

Bay6.prototype.model = function model() {
  if (typeof arguments[0] === "string") {
    return this.modelFromSchema.apply(this, arguments);
  } else {
    return this.modelFromMongoose.apply(this, arguments);
  }
}

Bay6.prototype.modelFromSchema = function modelFromSchema(name, schema, opts) {
  var model = mongoose.model(name, new mongoose.Schema(schema);
  return this.modelFromMongoose(model, opts);
}

Bay6.prototype.modelFromMongoose = function modelFromMongoose(model, opts) {
  opts = xtend(this.options, opts);
  var mod = new Model(model, opts);
  this._models.push(mod);
}

/**
 * Serves this Bay6 instance on an Express server.
 * Ensure bodyParser.json() is enabled!
 * 
 * @param {express} app - The app
 *
 */
Bay6.prototype.serveExpress = function serveExpress(app) {
  this._models.filter(function(model) {
    restify.serve(app, model.model, opts);
  }
}
