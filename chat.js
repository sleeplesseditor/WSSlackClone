const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'Welcome to Socket IO Server'});
    socket.on('messageToServer', (dataFromClient) => {
        console.log(dataFromClient)
    });
    socket.on('newMessageToServer', (msg) => {
        io.emit('messageToClients', {text: msg.text});
    });
});

io.of('/admin').on('connection', (socket) => {
    console.log('Connected to Admin NameSpace');
    io.of('/admin').emit('welcome', 'Welcome to Admin Channel');
});