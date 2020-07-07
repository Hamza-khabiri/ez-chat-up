const usersEl = document.getElementById( 'users' );
const messagesEl = document.getElementById( 'messages' );
const roomNameEl = document.getElementById( 'room-name' );

const socket = io();

let roomName = "";

/* Emit user info when connecting. */
socket.on('connect', () => {
    /* Build an object out of query parameters. */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams( queryString );
    const keys  = urlParams.keys();
    const paramsObject = {};
    
    for( entry of keys ) {
        paramsObject[ entry ] = urlParams.get( entry );
    }

    socket.emit('join', paramsObject, error => {
        if( error ) {
            alert( error );
            window.location.href = '/';
        }
    });
});

socket.on( 'roomJoined', name =>  roomName = name );

/* Destroy and rebuild users list. */
socket.on( 'updateUserList', users => {
    roomNameEl.innerText = roomName + ' (' + users.length + ')'

    const userListEl = document.getElementById( 'user-list' );

    if( userListEl )
        usersEl.removeChild( userListEl );

    const updatedUserListEl = document.createElement( 'ul' );
    updatedUserListEl.setAttribute( 'id', 'user-list' );
 
    users.forEach( user => {
        const userEl = document.createElement( 'li' );
        userEl.innerText = user;
        updatedUserListEl.appendChild( userEl );
    });

    usersEl.appendChild( updatedUserListEl );
});

/* Render received messages. */
socket.on( 'newMessage', message => {
    var formattedTime = moment( message.createdAt ).format( 'h:mm:ss a' );
    
    var template = document.getElementById( 'message-template' ).innerHTML;
    
    var messageEl = Mustache.render( template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });

    messagesEl.innerHTML =  messagesEl.innerHTML + messageEl;
    
    const lastMessage = messagesEl.querySelector( 'li:last-child' );

    lastMessage.scrollIntoView(true);
});
  
/* Prevent default form behavior and instead emit the message value through socket.io */
const messageFormEl = document.getElementById( 'message-form' );

messageFormEl.addEventListener( 'submit', event => {

    event.preventDefault();
  
    var messageTextbox = document.querySelector( '[name=message]' );
    socket.emit(
        'createMessage',
        { text: messageTextbox.value },
        () => { messageTextbox.value = ''; }
    );
});


const userListToggleButton = document.getElementById( 'user-list-toggle' );
const sidebarEl = document.getElementById( 'sidebar' ); 

userListToggleButton.addEventListener( 'click', () => {
    sidebarEl.classList.toggle( 'l-sidebar--shown' );
})

function scrollToBottom() {
    console.log(messagesEl.scrollTop)
    console.log(messagesEl.scrollHeight)
    
    messagesEl.scrollTo(0, messagesEl.scrollHeight);
    console.log(messagesEl.scrollTop)
}