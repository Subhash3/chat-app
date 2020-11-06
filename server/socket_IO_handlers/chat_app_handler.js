const { ChatsModel } = require('../Models/chats')

const chatAppHandler = (io) => {
    const MSG_PENDING = "pending"
    const MSG_SENT = "msg-sent"
    const MSG_NOT_SENT = "msg-not-sent"

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

    const infromSendersThatMessagesAreFlushed = (messagesIDs) => {
        // db.chats.update({id: {$in: ["1168fe5a-72e4-4506-8467-45060e3ecc46", "57524518-c329-4baa-9163-f94538c8b094"]}}, {$set: {status: "msg-sent"}}, {multi: 1})
        ChatsModel.update({
            id: { $in: messagesIDs }
        }, {
            $set: {
                "status": "msg-sent"
            }
        }, {
            multi: true
        })
    }

    const flushMessagesToUser = (socket, userID) => {
        console.log("[SOCKET.IO]: Flushing messages to user", userID)
        let allMessages = userIDToWaitQueueMap[userID]
        let allMessagesStringified = JSON.stringify(allMessages)
        socket.emit('flush-messages', allMessagesStringified)

        // console.log("All Msgs: ", allMessages)
        if (!allMessages) return

        let messagesIDToChangeStatus = []
        for (let msgString of allMessages) {
            let msg = JSON.parse(msgString)
            console.log("hihi", msg)
            messagesIDToChangeStatus.push(msg.id)
            let senderSocket = userIDToSocketMap[msg.senderID]
            senderSocket.emit('message-sent', msg.id)
        }

        infromSendersThatMessagesAreFlushed(messagesIDToChangeStatus)
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
            let { receiverID, id, senderID } = { ...msgObject }

            if (receiverID in userIDToSocketMap) {
                // console.log("\t[SOCKET.IO]: userIDToSockerMap: ", JSON.stringify(userIDToSocketMap))
                console.log("\t[SOCKET.IO]: Reciever is online!", receiverID)
                msgObject.status = MSG_SENT

                insertIntoDB(msgObject)
                    .then((data) => {
                        console.log("\t[SOCKET.IO]: Messages has been inserted", data)

                        let receiverSocket = userIDToSocketMap[receiverID]
                        console.log("\tEmitting [received-message] to", receiverID)
                        receiverSocket.emit('received-message', msgObjectString)
                        socket.emit('message-sent', id)
                    })
                    .catch((error) => {
                        console.log("\t[SOCKET.IO]: Error while inserting", error)
                        console.log("\tEmitting [message-not-sent] to ", receiverID)
                        socket.emit('message-not-sent', JSON.stringify(error), id)
                        return
                    })
            } else {
                let reason = "Reciever is offline!"
                msgObject.status = MSG_PENDING // It is the default. But I'm just being explicit.
                addMessageToWaitQueue(msgObjectString, receiverID)

                insertIntoDB(msgObject)
                    .then((data) => {
                        console.log("\t[SOCKET.IO]: Messages has been inserted", data)
                        console.log("\tEmitting [pending] to", senderID)
                        socket.emit('pending', reason, id)
                    })
                    .catch((error) => {
                        console.log("\t[SOCKET.IO]: Error while inserting", error)
                        console.log("\tEmitting [message-not-sent] to ", receiverID)
                        socket.emit('message-not-sent', JSON.stringify(error), id)
                        return
                    })
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