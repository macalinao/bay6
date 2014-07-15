var mongoose = require("mongoose");

module.exports = function() {
  return new Bay6();
}

function Bay6() {
  this._models = [];
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
  this._models.push({
    model: model,
    opts: opts
  }); 
}
