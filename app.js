const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
// For home page, respond with "Welcome"
// For /urls, respond with some URLs
// For any other path, respond with a 404 status code and "404 Page Not Found" as the body/contents
const requestHandler = function(request, response) {
  request.url === '/' ? response.end('Welcome') : request.url === '/urls' ? response.end(request.url) : response.end('404 :(');
  //response.end(`Requested Path: ${request.url}\nRequest Method: ${request.method}`);
};

const server = http.createServer(requestHandler);
console.log('Server created'); // NEW LINE

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

console.log('Last line (after .listen call)');