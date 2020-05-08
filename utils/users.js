const users = [];

function joinRoom (id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

function getCurrentUser (id){
    return users.find(userelem => userelem.id === id);
}

function userLeave(id){
    const index = users.findIndex(user=> user.id ===id);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

function getRoomUsers(room){
    console.log(users.find(user=>user.room === room))
    return users.filter(user=>user.room === room);
}

module.exports ={ joinRoom,getCurrentUser, userLeave,getRoomUsers};