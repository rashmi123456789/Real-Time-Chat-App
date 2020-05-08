const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const roomName = document.getElementById('room-name');
const socket = io();

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

socket.emit('joinRoom',{username,room});

socket.on('message',(message)=>{
    console.log(message);
    outPutMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomUsers',({room,users})=>{
    outPutRoomName(room);
    outPutUsers(users);
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log(msg)
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

function outPutMessage(message){
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

function outPutRoomName(room){
    roomName.innerText = room;

}

function outPutUsers(users){
    console.log("users");
    console.log(typeof(users));
    userList.innerHTML =`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}