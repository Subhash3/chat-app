const { ChatsModel } = require('../Models/chats')

const chatAppHandler = (io) => {
    let userIDToSocketMap = {}
    let userIDToWaitQueueMap = {}

    const getUserIDFromSocketID = (socketID) => {
        for (userID in userIDToSocketMap) {
            let userSocket = userIDToSocketMap[userID]
            if (userSocket.id === socketID)
                return userID
        }

        return null
    }

    const addMessageToWaitQueue = (msgObjectString, receiverID) => {
        if (receiverID in userIDToWaitQueueMap) {
            userIDToWaitQueueMap[receiverID].push(msgObjectString)
        } else {
            userIDToWaitQueueMap[receiverID] = [msgObjectString]
        }
    }

    const flushMessagesToUser = (socket, userID) => {
        let allMessages = userIDToWaitQueueMap[userID]
        let allMessagesStringified = JSON.stringify(allMessages)
        socket.emit('flush-messages', allMessagesStringified)
    }

    const removeUserTraces = (socketID) => {
        let userID = getUserIDFromSocketID(socketID)
        if (!userID)
            return

        delete userIDToSocketMap[userID]
        return
    }

    const insertIntoDB = (msgObject) => {
        // let chatObject = new ChatsModel(msgObject)
        // let dbPromise = chatObject.save()

        let dbPromise = ChatsModel.create(msgObject)
        return dbPromise
    }

    // const insertFlushedMessagesIntoDB = (userID) => {
    //     let allStringifiedMessages = userIDToWaitQueueMap[userID]
    //     if (!allStringifiedMessages) {
    //         return new Promise((resolve, reject) => {
    //             resolve("Wait queue is empty. No need to write to db")
    //         })
    //     }
    //     let allMessages = allStringifiedMessages.map(messageString => {
    //         return JSON.parse(messageString)
    //     })

    //     let dbPromise = ChatsModel.insertMany(allMessages)
    //     return dbPromise
    // }

    // listen on the connection event for incoming sockets
    io.on('connection', function (socket) {
        console.log('A new client connected', socket.id);

        socket.on('logged-in', userID => {
            console.log('[logged-in]: userID: ', userID)
            userIDToSocketMap[userID] = socket
            flushMessagesToUser(socket, userID)
            // insertFlushedMessagesIntoDB(userID)
            //     .then((data) => {
            //         console.log("Data has been flushed out and written into db.! : ", JSON.stringify(data))
            //         userIDToWaitQueueMap[userID] = []
            //     })
            //     .catch(err => {
            //         console.log("Error while writing flushed messages into db", err)
            //     })
            console.log('[logged-in]: Wait Queue: ', userIDToWaitQueueMap[userID])
            userIDToWaitQueueMap[userID] = []
        })

        socket.on('send-message', msgObjectString => {
            let msgObject = JSON.parse(msgObjectString)
            console.log("[send-message]: Received a new message.", msgObject)
            let { receiverID } = { ...msgObject }

            insertIntoDB(msgObject)
                .then((data) => {
                    console.log("Messages has been inserted", data)
                })
                .catch((error) => {
                    console.log("Error while inserting", error)
                    socket.emit('message-not-sent', JSON.stringify(error), receiverID)
                    return
                })

            if (receiverID in userIDToSocketMap) {
                let receiverSocket = userIDToSocketMap[receiverID]
                receiverSocket.emit('received-message', msgObjectString)
            } else {
                let reason = "Reciever is offline!"
                addMessageToWaitQueue(msgObjectString, receiverID)
                socket.emit('message-not-sent', reason, receiverID)
            }
        })

        socket.on('disconnect', (reason) => {
            console.log("Disconnected", socket.id, reason)
            removeUserTraces(socket.id)
        })
    });
}

module.exports = {
    chatAppHandler
}