var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    OnlineUsers = {};
	Users = [];
	BenutzerIp = [];
	BenutzerIpName = [];
server.listen(1338);
console.log("Server Online");
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
// wenn der Pfad / aufgerufen wird
app.get('/' ,function(req, res){
	// statische Dateien ausliefern
	res.sendFile(__dirname + '/login.html');
});

app.get('/JumpGo', function (req, res) {
     res.sendFile(path.join(__dirname, '/', 'index.html'));
});

io.sockets.on('connection', function (socket) {
var clientIp = socket.request.connection.remoteAddress; // Liefer die IP
var Vorhanden = BenutzerIp.indexOf(clientIp);
if(Vorhanden >= 0){
console.log("Ein Benutzer ist eingelogt oder wiedergekehrt");
socket.nickname = BenutzerIpName[Vorhanden];
OnlineUsers[socket.nickname] = socket;
//Setze den Player Start Punkt
socket.XCoords = 15;
socket.YCoords = 15;
socket.PlayerOrder = BenutzerIpName.length;
io.sockets.emit("PlayerSpawn", socket.XCoords, socket.YCoords, BenutzerIpName.length);
//updateNicknamesOnline();
//Falls der Spieler einen Disconnect hat trage hier alle wichtigen ereignise von diesem Spieler ein und lade diese auf den socket neu. Save-Data
}
	socket.on('Login', function(data, callback){ 
       if(data in OnlineUsers){
		console.log("Benutzer Existiert schon!");
           //io.sockets.emit('ServerMessege', socket.nickname+': <span class="online">ist wieder online</span>'+'</br>');
       }else{
	    console.log("Benutzer angelegt!");
		socket.nickname = data;
		OnlineUsers[socket.nickname] = socket;
		BenutzerIp.push(clientIp);
		BenutzerIpName.push(socket.nickname);
		socket.emit("Weiterleitung");
       }
      // UserIsBack();
    });
	socket.on('PlayerMovment', function(Direction){ 
		console.log("PlayerMovment Cast"+Direction);
		//Alte + neue position
		if(Direction === "Left"){
			if(socket.XCoords > 0){
				socket.XCoords = socket.XCoords - 1; // Geschwindikeit Left
				io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Left");
			}
		}else if(Direction === "Down"){
			if(socket.YCoords > 0 && socket.YCoords < 500){
				socket.YCoords = socket.YCoords + 1; // Geschwindikeit Left
				io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Down");
			}
		}else if(Direction === "Right"){
			if(socket.XCoords > 0 && socket.XCoords < 500){
				socket.XCoords = socket.XCoords + 1; // Geschwindikeit Left
				io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Right");
			}
		}else if(Direction === "Jump"){
			if(socket.YCoords > 0 && socket.YCoords < 500){
				socket.YCoords = socket.YCoords - 1; // Geschwindikeit Left
				io.sockets.emit('PlayerMovment', socket.XCoords, socket.YCoords, socket.PlayerOrder, "Jump");
			}
		}
	});	
});	