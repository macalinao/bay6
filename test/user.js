var expect = require("chai").expect;

var bay6 = require("../lib/");

describe("User", function() {
  var app;
  var User;

  before(function() {
    app = bay6();
    app.serve(9000);
    User = app.mongoose.model("User");
  });

  describe("#validPassword", function() {
    var bob;
    
    before(function(done) {
      bob = new User({username: "bob", password: "mfw"});
      // this in itself is a test of the hashing function
      bob.save(function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    it("should correctly validate the password", function() {
      expect(bob.validPassword("mfw")).to.be.true;
    });

    it("should reject an invalid password", function() {
      expect(bob.validPassword("MFW")).to.be.false;
    });
  });

  afterEach(function() {
    User.find().remove().exec();;
  });
});
