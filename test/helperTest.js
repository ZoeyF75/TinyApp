const assert = require('chai').assert.strictEqual;
const findEmail = require('../helper');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findEmail("user@example.com", testUsers).id;
    const expectedOutput = "userRandomID";
    assert(user, expectedOutput);
  });
  it('non-existent email returns undefined', function() {
    const exsists = findEmail("notreal@email.yeet.ca", testUsers);
    assert(exsists, undefined);
  });
});