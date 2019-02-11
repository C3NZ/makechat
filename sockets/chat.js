// chat sockets
//
// io.emit() - Sends data to all clients on the connection
// socket.emit() - Sends data to the client that sent the original data to the server

// Socket handling
module.exports = (io, socket, onlineUsers) => {
    // Handle a new user joining the chat
    socket.on('new user', (username) => {
        // Save the useranme as a key to access their socket id
        // and also save the username to the socket
        onlineUsers[username] = socket.id;
        socket.username = username;

        console.log(`${username} has joined the chat!`);
        
        // Send the username to all clients currently connected
        io.emit('new user', username)
    });

    // Handle a new message being sent
    socket.on('new message', (data) => {
        console.log(`${data.sender}: ${data.message}`)
        io.emit('new message', data);
    });

    socket.on('new channel', (newChannel) => {
        console.log(newChannel);
    })

    // Send all the online users to the client
    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    });

    // Handle when a user disconnects from a server
    socket.on('disconnect', () => {
        delete onlineUsers[socket.username];
        io.emit('user has left', onlineUsers);
    });
}
