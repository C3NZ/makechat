// chat sockets
//
// io.emit() - Sends data to all clients on the connection
// socket.emit() - Sends data to the client that sent the original data to the server

// Socket handling
module.exports = (io, socket) => {
    // Handle a new user joining the chat
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat!`);

        // Send the username to all clients currently connected
        io.emit('new user', username)
    });

    // Handle a new message being sent
    socket.on('new message', (data) => {
        console.log(`${data.sender}: ${data.message}`)
        io.emit('new message', data);
    })
}
