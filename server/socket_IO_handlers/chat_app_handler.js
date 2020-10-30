const { ChatsModel } = require('../Models/chats')

const chatAppHandler = (io) => {
    let userIDToSocketMap = {}
    let userIDToWaitQueueMap = {}
    let userIDToOnlineStatusMap = {}

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
        console.log("[SOCKET.IO]: Flushing messages to user", userID)
        let allMessages = userIDToWaitQueueMap[userID]
        let allMessagesStringified = JSON.stringify(allMessages)
        socket.emit('flush-messages', allMessagesStringified)
    }

    const removeUserTraces = (socketID) => {
        let userID = getUserIDFromSocketID(socketID)
        if (!userID)
            return

        userIDToOnlineStatusMap[userID] = false
        delete userIDToSocketMap[userID]
        return
    }

    const insertIntoDB = (msgObject) => {
        // let chatObject = new ChatsModel(msgObject)
        // let dbPromise = chatObject.save()

        let dbPromise = ChatsModel.create(msgObject)
        return dbPromise
    }

    // listen on the connection event for incoming sockets
    io.on('connection', function (socket) {
        console.log('[SOCKET.IO]: A new client connected', socket.id);

        socket.on('logged-in', userID => {
            console.log(".on(logged-in)")
            console.log('\t[logged-in]: userID: ', userID)
            userIDToSocketMap[userID] = socket
            userIDToOnlineStatusMap[userID] = true
            flushMessagesToUser(socket, userID)

            console.log('\t[logged-in]: Wait Queue: ', userIDToWaitQueueMap[userID])
            userIDToWaitQueueMap[userID] = []

            // Inform other users that he is online
            console.log("\tEmitting [online-statuses] to all users")
            io.emit('online-statuses', JSON.stringify(userIDToOnlineStatusMap))
        })

        socket.on('send-message', msgObjectString => {
            console.log(".on(send-message)")
            let msgObject = JSON.parse(msgObjectString)
            console.log("\t[send-message]: Received a new message.", msgObject)
            let { receiverID } = { ...msgObject }

            insertIntoDB(msgObject)
                .then((data) => {
                    console.log("\t[SOCKET.IO]: Messages has been inserted", data)
                })
                .catch((error) => {
                    console.log("\t[SOCKET.IO]: Error while inserting", error)
                    console.log("\tEmitting [message-not-sent] to ", receiverID)
                    socket.emit('message-not-sent', JSON.stringify(error), receiverID)
                    return
                })

            if (receiverID in userIDToSocketMap) {
                // console.log("\t[SOCKET.IO]: userIDToSockerMap: ", JSON.stringify(userIDToSocketMap))
                console.log("\t[SOCKET.IO]: Reciever is online!", receiverID)
                let receiverSocket = userIDToSocketMap[receiverID]
                console.log("\tEmitting [received-message] to", receiverID)
                receiverSocket.emit('received-message', msgObjectString)
            } else {
                let reason = "Reciever is offline!"
                addMessageToWaitQueue(msgObjectString, receiverID)
                console.log("\tEmitting [message-not-sent] to", receiverID)
                socket.emit('message-not-sent', reason, receiverID)
            }
        })

        socket.on('disconnect', (reason) => {
            console.log("Disconnected", socket.id, reason)
            removeUserTraces(socket.id)
            io.emit('online-statuses', JSON.stringify(userIDToOnlineStatusMap))
        })
    });
}

module.exports = {
    chatAppHandler
}