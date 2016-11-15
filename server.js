var http = require('http');
var app = require('./app');
var server;
server = http.createServer(app.callback());
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
