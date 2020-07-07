const path = require( 'path' );
const http = require( 'http' );
const express = require( 'express' );
const socketIO = require( 'socket.io' );

const { Messages } = require('./App/UseCases/Messages');
const { IsRealString } = require('./App/Utils/index');
const { Users } = require('./App/UseCases/Users');

const publicPath = path.join( __dirname, '../Public' );
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var messages = new Messages();

app.use(express.static(publicPath));

app.get('/', (req, res) => res.redirect('/index.html'))

io.on('connection', socket => {
    /* Register the user in the user list and notify the other connected users. */
    socket.on('join', ( params, callback ) => {
        const { name, room } = params;
  
        if ( !IsRealString( name ) || !IsRealString( room ) ) {
          return callback( 'Name and room are required.' );
        }

        socket.join(room);
        users.Remove( socket.id );
        users.Add( socket.id, name, room );
        
        socket.emit( 'roomJoined', room );

        io.to( room ).emit( 'updateUserList', users.GetList( room ) );
        
        socket.emit( 'newMessage', messages.Generate( 'Admin', 'Welcome to the chat room' ) );
        
        messages.Get().forEach( message => {
            socket.emit( 'newMessage', message );
        });

        socket.broadcast.to( room ).emit( 'newMessage', messages.Generate('Admin', `${name} has joined.` ) );
        
        callback();
    });

    socket.on( 'createMessage', ( message, callback ) => {
        var user = users.Get( socket.id );
    
        if (user && IsRealString(message.text)) {
          io.to( user.room ).emit( 'newMessage', messages.Generate( user.name, message.text ) );
        }
    
        callback();
    });

    
  socket.on( 'disconnect', () => {
    var user = users.Remove( socket.id );

    if( user ) {
      io.to( user.room ).emit( 'updateUserList', users.GetList());
      io.to( user.room ).emit( 'newMessage', messages.Generate( 'Admin', user.name + ' has left.' ) );
    }
  });
});

server.listen(port, () => {
    console.log('server is up on ' + port);
});
