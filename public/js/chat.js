const socket = io.connect(window.location.origin);

var user;

function getUserData(callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };

    xhttp.open("GET", "/users/me", true);
    xhttp.send();
}

//Setting user data and socket communication
getUserData(res => {
    user = JSON.parse(res);

    const { room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

    socket.on('message', (message) => {
        const html = Mustache.render(messageTemplate, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
    
        $messages.insertAdjacentHTML('beforeend', html);
        autoscroll();
    });
    
    socket.on('sendMessage', (message) => {
        console.log(message);
    });
    
    socket.on('roomData', ({ room, users }) => {
        const html = Mustache.render(sidebarTemplate, {
            room,
            users
        });
    
        document.querySelector('#sidebar').innerHTML = html;
    });
    
    $messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const textField = e.target.elements.message;
        const message = textField.value;
    
        $messageFormInput.value = "";
        $messageFormInput.focus();
    
        if (message) {
            socket.emit('sendMessage', message, (error) => {
                if (error) {
                    return console.log(error);
                }
        
                console.log('message delivered!');
            });
        }
    });
    
    socket.emit('join', { username: user.username, room }, (error) => {
        if(error) {
            alert(error);
            window.location = '/';
        }
    });
});

// DOM Elements
const $messageForm = document.querySelector('#message_form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('input[type="submit"]');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far the user has scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = containerHeight;
    }
};