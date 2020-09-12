const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//custom functions
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const assistant = "VIRTUAL HELPER"

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Running on client side connection
io.on('connection', socket => {

//to catchthe join room message
socket.on('joinRoom', ({username, room}) => {
	const user = userJoin(socket.id , username , room);
	socket.join(user.room);
	//to be retrived in client side @main.js to welcome a current user
socket.emit('message',formatMessage(assistant,  "Welcome to ChatCord!"))

//to broadcast to all members of chat when a client connects
socket.broadcast
.to(user.room)
.emit(
	'message', 
	formatMessage(assistant,`${user.username} joined the chat`));

})



//to show when a user leaves
socket.on('disconnect', () =>{
	const user = userLeave(socket.id);
	if (user) {
		io.to(user.room).emit('message', formatMessage(assistant,`${user.username}left the chat`)),
		//Send users and 
	io.to(user.room).emit('roomUsers' , {
		room: user.room,
		users: getRoomUsers(user.room)
	});

	}
	
});
//handling the messages
socket.on('chatMessage', msg => {
	const user = getCurrentUser(socket.id)
	io.to(user.room).emit('message', formatMessage(user.username, msg));
})
//io.on ends
});

const PORT = 3001

server.listen(PORT, () => console.log('Server running on port 3001'))