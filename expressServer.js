const express = require("express");
const bcrypt = require('bcrypt');
const functions = require('./helper');
const findEmail = functions.findEmail;
const generateRandomString = functions.generateRandomString;
const urlsForUser = functions.urlsForUser;
//converts the request body from a Buffer into string, adds the data to the req object under the key body
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080
const users = {};
const urlDatabase = {};

//req.session.userID name of the cookie

//tells express app to use ejs as its templating engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['123banana'] //characters the cookie name is encrypted with
}));

//home page
app.get("/", (req, res) => {
  return req.session.userID ? res.redirect('/urls') : res.redirect('/login');
});

//routes below
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };
  return !req.session.userID ? res.render('urlsRegistration.ejs', templateVars) : res.redirect('/urls');
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };
  return !req.session.userID ? res.render('urlsLogin.ejs', templateVars) : res.redirect('/urls');
});

//My URLS page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.userID, urlDatabase),
    user: users[req.session.userID]
  };
  return res.render('urlsIndex', templateVars);
});

//create new shortURL route
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };
  req.session.userID ? res.render('urlsNew', templateVars) : res.redirect('/login');
});

//Renders edit page to change shortURL
app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.userID],
      urlUserID: urlDatabase[req.params.shortURL].userID
    };
    res.render("urlsShow" , templateVars);
  } else {
    return res.status(404).send("Page not found.");
  }
});

//redirects to new page if longURL given by user is valid
app.get("/u/:shortURL", (req, res) => {
  //if shortURL exsists redirect to shorturl at long url in user database else error
  return urlDatabase[req.params.shortURL] ? res.redirect(urlDatabase[req.params.shortURL]['longURL']) : res.status(302).send("Resource requested has been moved or no longer exsists.");  //302 redirection code/ resource requested has been moved
});

//gets 404 page
app.get("*", (req,res) => {
  return res.status(302).send("Resource requested has been moved or no longer exsists.");
});

//updates the users edits to urls
app.post("/urls/:shortURL", (req,res) => {
  if (urlDatabase[req.params.shortURL]) { //if users database has the shortURL it can be edited
    urlDatabase[req.params.shortURL].longURL = req.body.newURL; //updates database
    return res.redirect('/urls');
  } else {
    return res.status(403).send("You are not authorized to remove or edit this url.");
  }
});

//delete button that when requested removes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect('/urls');
  }
  return res.status(403).send("You are not authorized to remove or edit this url.");
});

//My URLS with user inputs of URLS
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  }; //updates database object
  return res.redirect(`urls/${shortURL}`);
});

app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(404).send("Please ensure that none of the fields were left empty.");
  } else if (!findEmail(req.body.email, users)) { //if email is not found
    const userRandomID = generateRandomString();
    users[userRandomID] = {
      id: userRandomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.userID = userRandomID;
    res.redirect('/urls');
  } else {
    res.status(404).send("This email already exists please use a different one or login.");
  }
});

app.post("/login", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(404).send("Please ensure that none of the fields were left empty.");
  } else if (findEmail(req.body.email, users)) {
    //compares password used to login to the password of the email entered in the users object
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