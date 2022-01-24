const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    socket.emit('nsList', nsData);
});

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const userName = nsSocket.handshake.query.username;
        nsSocket.emit('nsRoomLoad', namespaces.rooms)
        nsSocket.on('joinRoom', (roomToJoin, numOfUsersCallback) => {
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            nsSocket.join(roomToJoin);
            // io.of('/wiki').in(roomToJoin).client((error, client) => {
            //     numOfUsersCallback(client.length);
            // })
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomtTitle === roomToJoin;
            });
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        });
        nsSocket.on('newMessageToServer', (msg) => {
            const fullMessage = {
                text: msg.text,
                time: Date.now(),
                username: userName,
                avatar: 'https://via.placeholder.com/30'
            }
            
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomtTitle === roomTitle;
            });
            nsRoom.addMessage(fullMessage);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMessage);
        });
    });
});

function updateUsersInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
    });
}