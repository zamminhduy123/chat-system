var express = require('express');
var http = require('http');

var app = express();
var server = http.Server(app);

//user list
var users = [];

var io = require('socket.io')(server);

server.listen(3333),function() {
    console.log("listing on port 3333");
}

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style/style.css',(req,res) => {
    res.sendFile(__dirname + '/style/style.css');
});

io.on('connection',(socket) => {
    var name = '';
    socket.on("has connected", (username) => {
        name = username;
        users.push(name);
        
        io.emit('has connected', {username: name, userList: users});
    });

    socket.on("disconnect", () => {
        users.splice(users.indexOf(name),1);
        io.emit('has disconnected', {username: name, userList: users});
    });

    socket.on('new message', (message) => {
        io.emit('new message', message);
    });
});