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
            //Register the new user and then send a request for all users
            socket.emit('new user', username);
            // handle the users successful login
            currentUser = username;
            $('.usernameForm').remove();
            $('.mainContainer').css('display', 'flex');
        }
    });

    // Send a new chat
    $('#sendChatBtn').click((e) => {
        e.preventDefault();

        const message = $('#chatInput').val();

        if (message.length > 0) {
            const msgData = {
                sender: currentUser,
                message,
            };

            // Send the msgData to the server and clear the chat
            socket.emit('new message', msgData);
            $('#chatInput').val('');
        }
    })

    // Create a new channel
    $('#newChannelBtn').click(() => {
        const newChannel = $('#newChannelInput').val();

        if (newChannel.length > 0) {
            socket.emit('new channel', newChannel);
            $('#newChannelInput').val('');
        }
    });

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
    });

    // Handle a new channel being created
    socket.on('new channel', (newChannel) => {
        $('.channels').append(`<div class="channel">${newChannel}</div>`);
    });

    socket.on('user changed channel', (data) => {
        $('.channelCurrent').addClass('channel');
        $('.channelCurrent').removeClass('channelCurrent');
        $(`.channel:contains('${data.channel}')`).addClass('channelCurrent');
        $('.channelCurrent').removeClass('channel');
        $('.message').remove();

        data.messages.forEach((message) => {
            $('.messageContainer').append(`
                <div class="message">
                    <p class="messageUser">${message.sender}: </p>
                    <p class="messageText">${message.message}</p>
                </div>
            `);
        });
    });

    // Handle when all the online users are being sent to the client
    socket.on('get online users', (onlineUsers) => {
        for(username in onlineUsers) {
            console.log(username);
            $('.usersOnline').append(`<p class="userOnline">${username}</p>`)
        }
    });

    // Handle when a user leaves the channel
    socket.on('user has left', (onlineUsers) => {
        $('.usersOnline').empty();

        for(username in onlineUsers) {
            $('.usersOnline').append(`<p class="userOnline">${username}</p>`);
        }
    })
})
