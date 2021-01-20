const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//converts the request body from a Buffer into string, adds the data to the req object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
const { request } = require("express");
app.use(cookieParser());

const users = { 
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
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let alphanumeric = '';
  for (let i = 0; i < 3; i++) {
  alphanumeric += Math.floor(Math.random()*9);
  alphanumeric += Math.random().toString(36).slice(2,3);  
  }
  return alphanumeric;
};

function findEmail(emailInput) {
  for (let u in users) {
    if (users[u].email === emailInput) {
      return true;
    }
  }
  return false;
}

//tells express app to use ejs as its templating engine
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]], users };
  res.render('urlsLogin.ejs', templateVars);
});

app.post("/login", (req, res) => {
  //have to update to coincide with registration implementation
  // res.cookie('username',req.body.username);
  // res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]], users };
  res.render('urlsRegistration.ejs', templateVars);
});

app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.redirect('404');
  } else if (findEmail(req.body.email)) {
    res.redirect('404');
  } else {
    const userRandomID = generateRandomString();
    users[userRandomID] = { id: userRandomID, email: req.body.email, password: req.body.password };
    res.cookie('userID', userRandomID);
    res.redirect('/urls');
  }
  console.log(findEmail(req.body.email));
  console.log(users);
});

//redirects to new page if longURL given by user is valid
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  longURL ? res.redirect(longURL): res.redirect('404');  //302 redirection code/ resource requested has been moved
});

//create new shortURL route
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]], users };
  res.render('urlsNew', templateVars);
});

//Renders edit page to change shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["userID"]] , users};
  res.render("urlsShow" , templateVars);
});

//updates the users edits to urls
app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newURL; //updates database
  res.redirect('/urls');
});

//delete button that when requested removes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//My URLS page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["userID"]], users };
  res.render('urlsIndex', templateVars);
});

//My URLS with user inputs of URLS
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body['longURL']; //updates database object
  res.redirect(`u/${shortURL}`);
});

//gets 404 page
app.get("*", (req,res) => {
  const templateVars = { user: users[req.cookies["userID"]] };
  res.status(404);
  res.render('404', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
