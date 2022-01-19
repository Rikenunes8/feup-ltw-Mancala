const http    = require('http');
const path    = require('path');
const url     = require('url');
const fs      = require('fs');
const conf    = require('./conf.js');
const ranking = require('./ranking.js');
const register = require('./register.js');
const join    = require('./join.js'); 
const leave   = require('./leave.js');
//const notify  = require('./notify.js');
//const update  = require('./update.js');

const {endResponse, endResponseWithError} = require('./utils.js');


function doPostRequest(request, response) {
  const pathname = url.parse(request.url).pathname;

  switch(pathname) {
    case '/ranking':
      ranking.get(request, response);
      break;
    case '/register':
      register.login(request, response);
      break;
    case '/join':
      join.join(request, response);
      break;
    case '/notify':
      break;
    case '/leave':
      leave.leave(request, response);
      break;
    default:
      endResponseWithError(response, 404, "Unknown POST request");
    break;
  }
}
function doGetRequest(request, response) {
  const pathname = url.parse(request.url).pathname;

  switch(pathname) {
    case '/update':
      /*update.remember(response);
      request.on('close', () => update.forget(response));
      setImmediate(() => update.update(counter.get()));
      break;*/
    default:
      endResponseWithError(response, 404, "Unknown POST request");
    break;
  }
}

const server = http.createServer( (request, response) => {
  switch(request.method) {
    case 'POST':
      doPostRequest(request, response);
      break;
    case 'GET':
      doGetRequest(request, response);
      break;
    default:
      response.writeHead(500); // 501 Not Implemented
      response.end();    
  }
});

server.listen(conf.port);