var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    OnlineUsers = {};
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
    res.sendFile(path.resolve('index.html'));
});

io.sockets.on('connection', function (socket) {
var clientIp = socket.request.connection.remoteAddress;
var Vorhanden = BenutzerIp.indexOf(clientIp);
if(Vorhanden >= 0){
var pos = BenutzerIp.indexOf(clientIp);
console.log("Ein Benutzer ist wiedergekehrt");
OnlineUsers[socket.nickname] = socket;
socket.emit("PlayerSpawn", 15, 15);
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
		//PlayerSpawn
       }
      // UserIsBack();
    });
});	