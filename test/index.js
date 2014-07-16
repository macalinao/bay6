"use strict";

var expect = require("chai").expect;
var request = require("supertest");

var bay6 = require("../lib/");
var mongoose = require("mongoose");

describe("Bay6", function() {
  describe("#model", function() {
    var app;

    before(function() {
      app = bay6();
    });

    it("should create a Schema if given an object", function() {
      var schema = {
        name: String,
        contents: String
      };
      var model = app.model("Document", schema);

      expect(model.name).to.equal("Document");
      expect(model.schema).to.not.equal(schema);
    });

    it("should copy the Schema if given a Schema", function() {
      var schema = new mongoose.Schema({
        name: String,
        contents: String
      });
      var model = app.model("Document", schema);
      
      expect(model.name).to.equal("Document");
      expect(model.schema).to.equal(schema);
    });
  });

  describe("full stack tests", function() {
    var app;
    var server;

    beforeEach(function() {
      app = bay6();
      app.options.prefix = "";
      app.model("Document", {
        title: String,
        contents: String
      });
      server = app.serve(9000);
    });

    it("should create a document", function(done) {
      var doc = {
        title: "mfw",
        contents: "lol"
      };

      request(server).post("/documents").send(doc).end(function(err, res) {
        if (err) {
          throw err;
        }

        expect(res.body.title).to.equal("mfw");
        expect(res.body.contents).to.equal("lol");
        done();
      });
    });

    it("should find a document", function(done) {
      var Document = app.mongoose.model("Document");
      var doc = new Document({title: "test", contents: "loremipsum"});
      doc.save(function(err) {
        if (err) {
          throw err;
        }
        request(server).get("/documents").end(function(err, res) {
          expect(res.body).to.be.an("Array");
          expect(res.body.length).to.equal(1);
          expect(res.body[0].title).to.equal("test");
          done();
        });
      });
    });

    afterEach("close server", function(done) {
      server.close();
      app.mongoose.db.dropDatabase(function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });
});


