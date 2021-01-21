function findEmail(emailInput, users) {
  for (let u in users) {
    if (users[u].email === emailInput) {
      return users[u];
    }
  }
  return undefined;
}

module.exports = findEmail;