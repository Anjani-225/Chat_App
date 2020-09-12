//FRONT END JAVASCRIPT
const socket  = io();
socket.on('message', message => {
	//client side sees this on their console 
	//this is the hub that connects the server.js to the main.js
	//All the emits are caught here and handled
	console.log(message);
	outputMessage(message);

	//scroll functionality
	chatMessages.scrollTop = chatMessages.scrollHeight;


});


const chatMessages = document.querySelector('.chat-messages');

//Handling when the user actually presses send
// the form id is called chat-form

//Retrieving the chatForm using its id
const chatForm = document.getElementById('chat-form');
//chatForm is now the object of the message box to we now make changes

//Obtain username and room data from url
const {username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Join Chatroom
socket.emit('joinRoom', {username,room})

//Get room and users values
socket.on('roomUsers', ({room , users}) => {
	outputRoomName(room);
	outputUsers(users);
});


chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	//getting the chats id because the input id is msg
	const msg = e.target.elements.msg.value;
	//giving message to server
	socket.emit('chatMessage', msg);
	//Clear chat
	e.target.elements.msg.value = ' ';
	e.target.elements.msg.focus();
});


//function of message to DOM
function outputMessage(message){
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

//Adding room name to DOM
function outputRoomName(room){
	roomName.innerHTML = room;
};

//Adding Users to DOM
function outputUsers(users){
	userList.innerHTML =`
	${users.map(user => `<li>${user.username}</li>`).join("")}
	`;
}





























