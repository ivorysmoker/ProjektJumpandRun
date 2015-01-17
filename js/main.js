$(document).ready(function() {
    var socket = io.connect();
    $('#Login').click(function() {
        var Checker = confirm("Bist du sicher?");
        if (Checker == false) {
            return false;
        } else {
            socket.emit('Login', $('#nickname').val());
        }
    });
    socket.on('Weiterleitung', function() {
        location.href = "JumpGo";
    });
    $(document).foundation();
});