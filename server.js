var PORT = 8080; 

require('http')
  .createServer(require('./server/express.js'))
    .listen(PORT, function () {
      console.info('http server listening on port %s', PORT);
    });
