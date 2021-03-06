/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/

var dataObj = {};
var responseObj = {"results":[]};


var requestHandler = function(request, response) {

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.


  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;


  headers['Content-Type'] = "application/json";
  console.log(request.url.indexOf("/classes/"));

  if(request.url.indexOf("classes")) {
    if(request.method === 'POST'){
      console.log("went inside post");
      var chunk = "";
      statusCode = 201;
      request.on('data', function(data) {
        chunk += data;
      });
      request.on('end', function() {
        dataObj = JSON.parse(chunk);
        responseObj.results.push(dataObj);
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(responseObj));
      });
    }
    if(request.method === 'GET'){
      console.log("went inside get");
      statusCode = 200;
      console.log("request url" + request.url);
      request.on('end', function() {
        console.log("end", statusCode, headers);
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(responseObj));
      });
    }

    if(request.method === 'OPTIONS') {
      statusCode = 200;
      console.log('options');
      response.writeHead(statusCode, headers);
      response.end(null);
    }
    console.log("went outside classes");

  } else {

      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end("404 Error");

  }
};

exports.requestHandler = requestHandler;



// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

