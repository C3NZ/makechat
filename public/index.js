// Wait for the client's document to load before loading
// any javascript
$(document).ready(() => {
    // Connect to the server
    const socket = io.connect();

    // Keep track of the user currently signed in
    let currentUser;

    // Handle when the user clicks the button
    $('#createUserBtn').click((e) => {
        e.preventDefault();
        const username = $('#usernameInput').val();

        // Make sure that the user has entered something for a name
        if (username.length > 0) {
            socket.emit('new user', username);

            // handle the users successful login
            currentUser = username;
            $('.usernameForm').remove();
            $('.mainContainer').css('display', 'flex');
        }
    });
    
    $('#sendChatBtn').click((e) => {
        e.preventDefault();

        const message = $('#chatInput').val();

        if (message.length > 0) {
            const msgData = {
                sender: currentUser,
                message,
            }
            socket.emit('new message', msgData);
            $('#chatInput').val('');
        }
    })

    // Handle when a new user joins the chat
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat!`);
        
        // Append the user that just logged in to the online list
        $('.usersOnline').append(`<div class="userOnline">${username}</div>`)
    });

    // Handle when a new message is sent
    socket.on('new message', (data) => {
        $('.messageContainer').append(`
            <div class="message">
                <p class="messageUser">${data.sender}: </p>
                <p class="messageText">${data.message}</p>
            </div>
        `);
    })
})
