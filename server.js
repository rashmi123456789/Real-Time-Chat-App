const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {formatMessages} =require('./utils/messages');
const {joinRoom,getCurrentUser,userLeave,getRoomUsers} =require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = 'Chat Bot'

app.use(express.static(path.join(__dirname,'view')));

io.on('connection', (socket)=>{

    socket.on('joinRoom',({username,room})=>{
        const user = joinRoom(socket.id,username,room);
        socket.join(room);

        socket.emit('message',formatMessages(chatBot,'Welcome to the Chat!!'));
        socket.broadcast.to(user.room).emit('message',formatMessages(chatBot,`${user.username} added to the Chat.`))

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessages(user.username,msg));
    })

    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessages(chatBot,`${user.username} has left the chat!`))

            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

})
const PORT = 3000 || process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`)
})