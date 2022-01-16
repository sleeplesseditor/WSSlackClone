const socket = io('http://localhost:9000');

socket.on('connect', () => {
    console.log(socket.id)
});

socket.on('nsList', (nsData) => {
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.img} /></div>`
    });
    Array.from(document.getElementsByClassName('.namespace')).forEach((element) => {
        element.addEventListener('click', (e) => {
            const nsEndpoint = element.getAttribute('ns');

        });
    });
    const nsSocket = io('http://localhost:9000/wiki');
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        
    });
});

socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer);
    socket.emit('messageToServer', ({data: 'This is from the client'}))
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer', { text: newMessage });
});

socket.on('messageToClients', (msg) => {
    console.log(msg);
});