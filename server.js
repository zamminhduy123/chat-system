var express = require('express');
var http = require('http');

var app = express();
var bcrypt = require('bcrypt');
var server = http.Server(app);
var bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//user list
var onlineUsers = [];
var users = [{
}];



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

app.get('/backEnd.js',(req,res) => {
    res.sendFile(__dirname + '/backEnd.js');
});

app.post('/login', async (req,res) => {
    const user = users.find(user => user.username == req.body.username);
    if (user === null){
        return res.status(400).send("Cannot find user!!!!");
    } 
    try {
        if (await bcrypt.compare(user.password,req.body.password)){
            res.sendStatus(200);
        } else {
            res.send("Wrong password or username!!");
        }
    } catch {
        res.sendStatus(500);
    }
    
    
})

app.post('/signUp', async (req,res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    try{
        user.password = await bcrypt.hash(req.body.password,10);
        users.push(user);
        res.sendStatus(200);
    } catch{
        res.status(500).send();
    }
    console.log(users);
})

io.on('connection',(socket) => {
    var name = '';
    socket.on("has connected", (username) => {
        name = username;
        onlineUsers.push(name);
        
        io.emit('has connected', {username: name, userList: onlineUsers});
    });

    socket.on("disconnect", () => {
        onlineUsers.splice(onlineUsers.indexOf(name),1);
        io.emit('has disconnected', {username: name, userList: onlineUsers});
    });

    socket.on('new message', (data) => {
        io.emit('new message', data);
    });
});