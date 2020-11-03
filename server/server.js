const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const http = require("http")
const socketIO = require("socket.io")
const dotenv = require("dotenv")
const { chatRouter } = require('./Routes/chat_router')
const { chatAppHandler } = require("./socket_IO_handlers/chat_app_handler")
const { connectToMongoDBAtlas } = require('./mongo_connection')
const path = require('path')
// const { UsersModel } = require('./Models/users')
// const { v4: uuid } = require("uuid")

// Configure dotenv (.env)
dotenv.config()

// global variables
const PORT = process.env.PORT || 3000
const app = express()
const server = http.Server(app)

const chatIO = socketIO(server, {
    origins: '*:*',
    path: '/chat-app-socket.io'
}, ['polling', 'websocket']) // I don't understand this part :(

/* Express Middleware */
app.use(bodyParser.json()) // Middleware to parse search params
app.use(cors()) // Middleware to resolve cors!

// app.get('/', (req, res) => {
//     res.send("Hello!")
// })

/*Custom Routes*/
app.use('/chat-app', chatRouter) // Router setup for chat-app

/* Setup socketIO handlers */
chatAppHandler(chatIO)

/*MongoDB*/
// let chatsDBURI = process.env.CHATS_MONGO_URI
// let usersDBURI = process.env.USERS_MONGO_URI
let YML_MONGO_URI = process.env.YML_MONGO_URI
connectToMongoDBAtlas(YML_MONGO_URI, "chatsDB")
// connectToMongoDBAtlas(chatsDBURI, "usersDB")

if (process.env.NODE_ENV === 'production') {
    console.log("PRODUCTION ENVIROMENT DETECTED!")
    app.use(express.static('../client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'))
    })
}

server.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("[SERVER]: Listening at http://<%s>:%s", host, port)
})

/** SOCKET IO CHEATSHEET **/
//  // send to current request socket client
//  socket.emit('message', "this is a test");// Hasn't changed

//  // sending to all clients, include sender
//  io.sockets.emit('message', "this is a test"); // Old way, still compatible
//  io.emit('message', 'this is a test');// New way, works only in 1.x

//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");// Hasn't changed

//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');// Hasn't changed

//  // sending to all clients in 'game' room(channel), include sender
//  io.sockets.in('game').emit('message', 'cool game');// Old way, DOES NOT WORK ANYMORE
//  io.in('game').emit('message', 'cool game');// New way
//  io.to('game').emit('message', 'cool game');// New way, "in" or "to" are the exact same: "And then simply use to or in (they are the same) when broadcasting or emitting:" from http://socket.io/docs/rooms-and-namespaces/

//  // sending to individual socketid, socketid is like a room
//  io.sockets.socket(socketid).emit('message', 'for your eyes only');// Old way, DOES NOT WORK ANYMORE
//  socket.broadcast.to(socketid).emit('message', 'for your eyes only');// New way