const socket = io('http://localhost:9000');
const adminSocket = io('http://localhost:9000/admin');

socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer);
    socket.emit('messageToServer', ({data: 'This is from the client'}))
});

adminSocket.on('welcome', (dataFromSocket) => {
    console.log(dataFromSocket)
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer', { text: newMessage });
});