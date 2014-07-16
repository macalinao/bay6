var expect = require("chai").expect;
var request = require("supertest");

var bay6 = require("../lib/");

describe("Auth", function() {
  var auth;

  beforeEach(function() {
    auth = bay6().auth;
  });

  describe("#extendUser", function() {
    it("should error when redefining username", function() {
      var fn = function() {
        auth.extendUser({username: String});
      };
      expect(fn).to.throw(/redefine username/);
    });

    it("should error when redefining password", function() {
      var fn = function() {
        auth.extendUser({password: String});
      };
      expect(fn).to.throw(/redefine username/);
    });

    it("should add a property to the user schema", function() {
      auth.extendUser({email: String});
      expect(auth._userSchema.email).to.equal(String);
      expect(auth._userSchema.username).to.not.equal(undefined);
    });

    it("should not overwrite other defined user fields", function() {
      auth.extendUser({email: String});
      auth.extendUser({email: Number});
      expect(auth._userSchema.email).to.equal(String);
    });
  });
});
