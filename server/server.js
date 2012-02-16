//********************* INIT THE SERVER ***************************************/
var app = require('http').createServer(handler)
    , socketio = require('socket.io')
    , fs = require('fs')

app.listen(80);

//********************* INIT THE ADMIN SERVER ***************************************/
function handler (req, res) {
    var fileUrl = __dirname + '/index.html'
    fs.readFile(fileUrl,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html from ' + fileUrl);
            }

            res.writeHead(200);
            res.end(data);
        });
}
console.log("Admin server is alive and kicking");

//********************* INIT THE CLIENT SERVER ***************************************/
var SOCKET_PORT = 8082;
var io = socketio.listen(SOCKET_PORT);
console.log("WebSocket server listens on port "+SOCKET_PORT);
io.configure('production', function() {
    io.enable('browser client etag');
    io.set('log level', 1);
    io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
});
io.configure('development', function() {
    io.set('log level', 1);
});
io.sockets.on('connection', function (socket) {
    socket.emit('event', {event: 'connected'});
    socket.on('clientMessage', function (data) {
        console.log("Message recieved: " + data);
    });
});

console.log("Client server is alive");
