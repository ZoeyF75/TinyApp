# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["This is the registration page, the style of the login page is very similar."](https://github.com/ZoeyF75/TinyApp/blob/master/docs/Register.jpg?raw=true)

!["This is the main URL page, where a user can acess all their shortened URL's."](https://github.com/ZoeyF75/TinyApp/blob/master/docs/MyURLPage.jpg?raw=true)

!["This is the main URL page when a user visits the /url/:id link without being logged in. A similar message is displayed if the user is logged in but the shortened URL is not in their database."](https://github.com/ZoeyF75/TinyApp/blob/master/docs/NotLoggedIn.jpg?raw=true)

!["This is the Registration page! The style of the Login page is very similar."](https://github.com/ZoeyF75/TinyApp/blob/master/docs/Update.jpg?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command or `npm start` to run the program using nodemon. 

## Minor Bugs to look out for

- Nodemone has a tendency to crash leaving port 8080 still open. In this case: 
```
  netstat -vanp --tcp | grep 8080 //find the instance where the server is still running
  kill -9 <insert instance number here>
```
- If a user types in a non url ––like just a random string of text–– in the create new url input, this results in an error. Given the time, regular expression could be used to fix this; however, I have not learned how to use regular expression to verify Hypertext Transfer Protocol's.

- If a user is not logged in and they make a get request to /urls, the app still takes them to the urls page; however, an info alert to login or register is displayed at the top of the page.

- If a user is not logged in and they make a get request to /urls/:id, the app still takes them to the short Urls page; however, the edit button is disabled from the front end and the backend doesn't allow edits either. Furthermore, from the front end, a danger alert is displayed at the top of the page.

