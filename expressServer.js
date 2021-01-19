const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  let ranNum = Math.floor(Math.random()*9);
  //let ranLet = Math.random().toString(36);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//tells express app to use ejs as its templating engine
app.set("view engine", "ejs");

//converts the request body from a Buffer into string, adds the data to the req object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//get routes
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urlsIndex", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urlsNew");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
res.render("urlsShow" , templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok'
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
