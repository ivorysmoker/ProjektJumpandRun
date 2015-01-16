var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};
server.listen(1338);
console.log("Server Online");
var mysql = require('mysql');
// wenn der Pfad / aufgerufen wird
app.get('/' ,function(req, res){
	// statische Dateien ausliefern
	res.sendfile(__dirname + '/index.html');
});