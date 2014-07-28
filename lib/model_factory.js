'use strict';

var mongoose = require('mongoose');
var restifier = require('restifier');

module.exports = ModelFactory;

function ModelFactory(app) {
  this.app = app;
  this.restifier = restifier.api();
}

ModelFactory.prototype.createFactoryFunction = function() {
  var factory = this;
  return function() {
    if (arguments.length === 0) {
      throw new Error('You must specify arguments for the model factory function.');
    }

    var arg = arguments[0];
    if (arg.modelName) {
      return factory.modelFromMongoose(arg);
    } 
    
    if (arguments.length === 1) {
      throw new Error('You must specify both a name and schema.');
    }

    if (typeof arg !== 'string') {
      throw new Error('First argument in model factory function must be a string.');
    }

    var schema = arguments[1];
    if (schema.paths) {
      return factory.modelFromSchema(arg, schema);
    } else if (typeof schema === 'object') {
      return factory.modelFromObject(arg, schema);
    }

    throw new Error('Unknown schema "' + schema + '" for factory function.');
  };
};

ModelFactory.prototype.modelFromMongoose = function(model) {
  return this.restifier.model(model);
};

ModelFactory.prototype.modelFromSchema = function(name, schema) {
  return this.modelFromMongoose(this.app.mongoose.model(name, schema));
};

ModelFactory.prototype.modelFromObject = function(name, object) {
  return this.modelFromObject(name, new mongoose.Schema(object));
};
