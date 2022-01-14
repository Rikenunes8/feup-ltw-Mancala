function endResponse(response, status, obj) {
  response.writeHead(status);
  response.write(JSON.stringify(obj));
  response.end();
}

function endResponseWithError(response, status, message) {
  response.writeHead(status);
  response.write(JSON.stringify({'error': message}));
  response.end();
}

module.exports = {endResponse, endResponseWithError};