// Wait for the client's document to load before loading
// any javascript
$(document).ready(() => {
    // Connect to the server
    const socket = io.connect();
    
    // Handle when the user clicks the button
    $('#createUserBtn').click((e) => {
        e.preventDefault();
        const username = $('#usernameInput').val();

        // Make sure that the user has entered something for a name
        if (username.length > 0) {
            socket.emit('new user', username);
            $('.usernameForm').remove();
        }
    });

    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat!`);
    })
})
