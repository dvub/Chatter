const jwt = require('jsonwebtoken')
const db = require('./db_query')
const users = require('./local_users')
class Manager {

    constructor() {}

    #userId = null
    authenticate = async (socket, token, callback) => {
        try {
            var decoded = jwt.verify(token, 'secret')
        
            var id = decoded.data.id
            this.#userId = id
            var username = decoded.data.username
            const user = await db.findUserById(id)
        
            if (!(user[0][0].id === id)) {
            return callback(null, false)
            }
            else {
            users.addUser(id, socket, username)
            return callback(null, true);
            }
        }
        catch (e) {
            console.log(e)
            return callback(new Error(e))
        }
    }
    postAuthenticate = async (socket, data) => {
        if (this.#userId) {
            socket.emit('sendFriends', await db.getFriendsOfUser(this.#userId))
        }
        socket.on('send_message', (toId, data) => {
          var fromUser = users.findUserBySocketId(socket.id)
          var toUser = users.findUserById(toId)
          if (fromUser && toUser) {
            socket.broadcast.to(toUser.socketId).emit('return_message', fromUser.username, data)
            socket.emit('return_message', fromUser.username, data)
          }
        })
    }
    disconnect = (socket) => {
        users.removeUser(socket.id)
    }
}
module.exports = new Manager()