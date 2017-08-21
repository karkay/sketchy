var config = require(__dirname + '/config');
var express = require('express');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

connections =[];
server.listen(config.port);


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//console.log(' * Running on http://' + config.server + ':' + config.port.toString());

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    var clientIp = socket.request.connection.remoteAddress;
    console.log('New connection: ' + clientIp + '| socket id: '+socket.id);

    //disconnect
    socket.on('disconnect',function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s sockets connected', connections.length);

    });

    //listens for a room name and joins it!
    socket.on('sessionID', function(data){
            var ip = socket.request.connection.remoteAddress;
            var room = data;
            socket.room = room;
            socket.join(socket.room);
            console.log("[ " + socket.id + " ] "+ " joined sessionID: " + " [ " + data + " ] ");
            //io.sockets.in(socket.room).emit('userJoin');//sends to everyone including sender
            socket.broadcast.to(socket.room).emit('userJoin');

    });

    socket.on('mouse', function(data) {
        if (data.thickness < 50) {
            //io.sockets.in(socket.room).emit('mouse',data);
            socket.broadcast.to(socket.room).emit('mouse',data);
        }
   });

    socket.on('clearCanvas',function(data){
        io.sockets.in(socket.room).emit('serverClear');
    });

});
