const express = require("express");
const bcrypt = require('bcrypt');
const findEmail = require('./helper');
//converts the request body from a Buffer into string, adds the data to the req object under the key body
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

const app = express();
const PORT = 8080; // default port 8080

//tells express app to use ejs as its templating engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['123banana']
}));

const users = {}
const urlDatabase = {};

function generateRandomString() {
  let alphanumeric = '';
  for (let i = 0; i < 3; i++) {
  alphanumeric += Math.floor(Math.random()*9);
  alphanumeric += Math.random().toString(36).slice(2,3);  
  }
  return alphanumeric;
};


function urlsForUser(id) {
  const userBase = {};
  for(let u in urlDatabase) {
    if (urlDatabase[u].userID === id) { //if database at the shortURL of the userID key equals id
      userBase[u] = urlDatabase[u]; //adds key 
    }
  }
  return userBase;
};

//routes below
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.userID], users };
  return res.render('urlsRegistration.ejs', templateVars);

});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.userID] };
  return res.render('urlsLogin.ejs', templateVars);
});

//My URLS page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(req.session.userID), user: users[req.session.userID], users };
  return res.render('urlsIndex', templateVars);
});
//create new shortURL route
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.userID], users };
  req.session.userID ? res.render('urlsNew', templateVars) : res.redirect('/login');
});
//Renders edit page to change shortURL
app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.userID] , urlUserID: urlDatabase[req.params.shortURL].userID };
    res.render("urlsShow" , templateVars);
  } else {
    return res.status(404).send("Page not found.")
  }
});

//redirects to new page if longURL given by user is valid
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  longURL === undefined ? res.status(302).send("Resource requested has been moved or no longer exsists.") : res.redirect(longURL);  //302 redirection code/ resource requested has been moved
});

//gets 404 page
app.get("*", (req,res) => {
  const templateVars = { user: users[req.session.userID] };
  console.log(req.url);
  res.status(404) ? res.render('404', templateVars) : res.render('403', templateVars);
});

//updates the users edits to urls
app.post("/urls/:shortURL", (req,res) => {
  if (urlDatabase[req.params.shortURL]) { //if users database has the shortURL it can be edited
    urlDatabase[req.params.shortURL].longURL = req.body.newURL; //updates database
    return res.redirect('/urls');
  } else {
    res.status(403).send("You are not authorized to remove or edit this url.");
  }
});

//delete button that when requested removes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect('/urls');
  }
  res.status(403).send("You are not authorized to remove or edit this url.");
});

//My URLS with user inputs of URLS
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.userID}; //updates database object
  return res.redirect(`u/${shortURL}`);
});

app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(404).send("Please ensure that none of the fields were left empty.");
  } else if (!findEmail(req.body.email, users)) { //if email is not found
    const userRandomID = generateRandomString();
    users[userRandomID] = { id: userRandomID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
    req.session.userID = userRandomID; 
    res.redirect('/urls');
  } else {
    res.status(404).send("This email already exists please use a different one or login.");
  }
});

app.post("/login", (req, res) => {
  console.log(req.body.password);
  if (req.body.email === '' || req.body.password === '') {
    return res.status(404).send("Please ensure that none of the fields were left empty.");
  } else if (findEmail(req.body.email, users)) { 
      if (bcrypt.compareSync(req.body.password, findEmail(req.body.email, users).password)) { 
      req.session.userID = findEmail(req.body.email, users).id;
      res.redirect('/urls');
    } else {
      return res.status(403).send("Password or email does not match.");
    }
  } else {
    return res.status(403).send("User does not exist.");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
