function findEmail(emailInput, users) {
  for (let u in users) {
    if (users[u].email === emailInput) {
      return users[u];
    }
  }
  return undefined;
}

function generateRandomString() {
  let alphanumeric = '';
  for (let i = 0; i < 6; i++) {
    alphanumeric += Math.random().toString(36).slice(2,3);
  }
  return alphanumeric;
}

function urlsForUser(id, urlDatabase) {
  const userBase = {};
  for (let u in urlDatabase) {
    if (urlDatabase[u].userID === id) { //if database at the shortURL of the userID key equals id
      userBase[u] = urlDatabase[u]; //adds key
    }
  }
  return userBase;
}

module.exports = {
  findEmail,
  generateRandomString,
  urlsForUser
};