var async = require("async");
var bay6 = require("../lib/");
var expect = require("chai").expect;
var mongoose = require("mongoose");
var request = require("supertest");

describe("Model", function() {
  var app;
  var server;
  var model;

  beforeEach(function() {
    app = bay6();
    app.options.prefix = "";
    model = app.model("Document", {
      title: String,
      contents: String
    });
  });

  describe("#limit", function() {
    it("should return a maximum of n documents", function(done) {
      model.limit(5);

      populateAndGet(function(err, res) {
        expect(res.body.length).to.equal(5);
        done();
      });
    });
  });

  afterEach(function(done) {
    app.mongoose.db.dropDatabase(done);
    server.close();
  });

  function populateAndGet(cb) {
    server = app.serve(9000);
    var Document = app.mongoose.model("Document");
    async.each([1, 2, 3, 4, 5, 6], function(useless, done2) {
      var doc = new Document({ title: "war and peace", contents: "yolo" });
      doc.save(done2);
    }, function(err) {
      if (err) {
        throw err;
      }
      request(server).get("/documents").end(cb);
    });
  }
});

