var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    OnlineUsers = {};
Users = [];
BenutzerIp = [];
BenutzerIpName = [];
server.listen(1337);
console.log("Server Online");
//var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
// wenn der Pfad / aufgerufen wird
app.get('/', function(req, res) {
    // statische Dateien ausliefern
    res.sendFile(__dirname + '/views/home.html');
});

app.use(express.static(__dirname, 'css'));
app.use(express.static(__dirname, 'js'));

app.get('/login', function(req, res) {
    // statische Dateien ausliefern
    res.sendFile(__dirname + '/views/login.html');
});
app.get('/JumpGo', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
var PhysikNumber = 0;
io.sockets.on('connection', function(socket) {
    var clientIp = socket.request.connection.remoteAddress; // Liefer die IP
    var Vorhanden = BenutzerIp.indexOf(clientIp);
    if (Vorhanden >= 0) {
        console.log("Ein Benutzer ist eingelogt oder wiedergekehrt");
        var pos = BenutzerIp.indexOf(clientIp);
        socket.nickname = BenutzerIpName[pos];
        OnlineUsers[socket.nickname] = socket;
        console.log(OnlineUsers[socket.nickname]);
        //Setze den Player Start Punkt
        socket.XCoords = 15;
        socket.YCoords = 15;
        socket.PlayerOrder = BenutzerIpName.length;
        io.sockets.emit("PlayerSpawn", socket.XCoords, socket.YCoords, BenutzerIpName.length);
        //updateNicknamesOnline();
        //Falls der Spieler einen Disconnect hat trage hier alle wichtigen ereignise von diesem Spieler ein und lade diese auf den socket neu. Save-Data
    }
    socket.on('Login', function(data, callback) {
        if (data in OnlineUsers) {
            console.log("Benutzer Existiert schon!");
            //io.sockets.emit('ServerMessege', socket.nickname+': <span class="online">ist wieder online</span>'+'</br>');
        } else {
            console.log("Benutzer angelegt!");
            socket.nickname = data;
            OnlineUsers[socket.nickname] = socket;
            console.log(OnlineUsers[socket.nickname]);
            BenutzerIp.push(clientIp);
            BenutzerIpName.push(socket.nickname);
            socket.XCoords = 15;
            socket.YCoords = 15;
            socket.PlayerOrder = BenutzerIpName.length;
            socket.emit("Weiterleitung");
        }
        // UserIsBack();
    });
    socket.on('PlayerMovment', function(Direction) {
        console.log("PlayerMovment Cast" + Direction);
        //Alte + neue position
        if (Direction === "Left") {
            console.log(socket.nickname + socket.PlayerOrder);
            if (socket.XCoords > 0) {
                socket.XCoords = socket.XCoords - 1; // Geschwindigkeit Left
                io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Left");
                console.log(socket.nickname + " PlayerMove Position: X: " + socket.XCoords + " Y:" + socket.YCoords);
            }
        } else if (Direction === "Down") {
            if (socket.YCoords > 0 && socket.YCoords < 500) {
                socket.YCoords = socket.YCoords + 1; // Geschwindigkeit Down
                io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Down");
                console.log(socket.nickname + " PlayerMove Position: X: " + socket.XCoords + " Y:" + socket.YCoords);
            }
        } else if (Direction === "Right") {
            if (socket.XCoords > 0 && socket.XCoords < 500) {
                socket.XCoords = socket.XCoords + 1; // Geschwindigkeit Right
                io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Right");
                console.log(socket.nickname + " PlayerMove Position: X: " + socket.XCoords + " Y:" + socket.YCoords);
            }
        } else if (Direction === "Jump") {
            if (socket.YCoords > 0 && socket.YCoords < 500) {
                socket.YCoords = socket.YCoords - 1; // Geschwindigkeit Jump
                io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Jump");
                console.log(socket.nickname + " PlayerMove Position: X: " + socket.XCoords + " Y:" + socket.YCoords);
            }
        }
    });
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
	++++++++++++++++++++++++++++++++++++++++++++++++FUNCTIONS++++++++++++++++++++++++++++++++++++++ 
	 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    function PhsyikTrigger() {
        if (typeof myVar !== 'undefined') {
            clearTimeout(myVar);
        }
        myVar = setTimeout(function() {
            console.log("Physik Trigger");
            PhysikNumber++;
            socket.emit("PlayerMovment");
            if (PhysikNumber > 0) {
                PhsyikTrigger();
            }
        }, 10000) //1000.0/30.0 30 fps +-
    }
    PhsyikTrigger();
});