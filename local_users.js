var users = []
class Manager {
    constructor() {}

    findUserById = (id) => {
        var user = users.find(user => user.userId === parseInt(id))
        if (user) return user
        return
    }
    findUserBySocketId = (targetSocketId) => {
        var user = users.find((user) => (user.socketId === targetSocketId))
        if (user) return user
        return
    }
    addUser = (id, socket, username) => {
        users[users.length] = {
            userId: id,
            username: username,
            socketId: socket.id
        }

        users = users.filter(value => Object.keys(value).length !== 0)
    }
    removeUser = (socketId) => {
        var user = this.findUserBySocketId(socketId)
        var index = users.indexOf(user)
        users.splice(index, 1)
    }
}
module.exports = new Manager()
