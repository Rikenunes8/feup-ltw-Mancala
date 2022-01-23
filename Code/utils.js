const headers = {
  plain: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'        
  },
  sse: {    
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Connection': 'keep-alive'
  }
};

function setHeaders(response, type) {
  const heads = headers[type];
  for (const head in heads) {
    response.setHeader(head, heads[head]);
  }
}

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



module.exports = {endResponse, endResponseWithError, setHeaders};