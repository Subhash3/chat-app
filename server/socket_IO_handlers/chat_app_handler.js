const { ChatsModel } = require('../Models/chats')

const chatAppHandler = (io) => {
    const MSG_PENDING = "pending"
    const MSG_SENT = "msg-sent"
    const MSG_NOT_SENT = "msg-not-sent"

    const WAIT_QUEUE_MSG_KEY = "messages"
    const WAIT_QUEUE_SOCKET_EVENTS_KEY = "socket-events"

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

    const isUserOnline = (userID) => {
        return (userID in userIDToSocketMap)
    }

    const initWaitQueue = (userID) => {
        userIDToWaitQueueMap[userID] = {
            [WAIT_QUEUE_MSG_KEY]: [],
            [WAIT_QUEUE_SOCKET_EVENTS_KEY]: []
        }

        return
    }

    const addMessageToWaitQueue = (msgObjectString, userID) => {
        console.log("Adding message to wait queue...")
        if (!(userID in userIDToWaitQueueMap)) {
            console.log("\tUserID:", userID, "is not in wait queue")
            initWaitQueue(userID)
        }
        userIDToWaitQueueMap[userID][WAIT_QUEUE_MSG_KEY].push(msgObjectString)

        return
    }

    const addSocketEventToWaitQueue = (userID, socketEventParams) => {
        console.log("Adding socket event to wait queue...")
        if (!(userID in userIDToWaitQueueMap)) {
            // userIDToWaitQueueMap[userID] = [msgObjectString]
            initWaitQueue(userID)
        }
        userIDToWaitQueueMap[userID][WAIT_QUEUE_SOCKET_EVENTS_KEY].push(socketEventParams)

        return
    }


    const updateMessageStatusOnDatabase = (messagesIDs) => {
        // db.chats.update({id: {$in: ["1168fe5a-72e4-4506-8467-45060e3ecc46", "57524518-c329-4baa-9163-f94538c8b094"]}}, {$set: {status: "msg-sent"}}, {multi: 1})
        ChatsModel.update({
            id: { '$in': messagesIDs }
        }, {
            '$set': {
                "status": "msg-sent"
            }
        }, {
            multi: true
        })

        return
    }

    const flushMessagesToUser = (socket, userID) => {
        console.log("[SOCKET.IO]: Flushing messages to user", userID)
        let allMessages = userIDToWaitQueueMap[userID][WAIT_QUEUE_MSG_KEY]
        let allMessagesStringified = JSON.stringify(allMessages)
        socket.emit('flush-messages', allMessagesStringified)

        // console.log("All Msgs: ", allMessages)
        if (!allMessages) return

        let messagesIDToChangeStatus = []
        for (let msgString of allMessages) {
            let msg = JSON.parse(msgString)
            let senderID = msg.senderID

            messagesIDToChangeStatus.push(msg.id)

            let socketEventParams = ['message-sent', msg.id]
            if (isUserOnline(senderID)) {
                let senderSocket = userIDToSocketMap[msg.senderID]
                console.log(`\tEmitting [${socketEventParams[0]}] to ${senderID}`)
                senderSocket.emit(...socketEventParams)
            } else {
                addSocketEventToWaitQueue(senderID, socketEventParams)
            }
        }

        updateMessageStatusOnDatabase(messagesIDToChangeStatus)

        return
    }

    const flushSocketEventsToUser = (socket, userID) => {
        let allSocketEvents = userIDToWaitQueueMap[userID][WAIT_QUEUE_SOCKET_EVENTS_KEY]
        for (socketEvent of allSocketEvents) {
            socket.emit(...socketEvent)
        }

        return
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

            // Save his online status and socket
            userIDToSocketMap[userID] = socket
            userIDToOnlineStatusMap[userID] = true

            // Flush messages and socket_io events
            if (userID in userIDToWaitQueueMap) {
                flushMessagesToUser(socket, userID)
                flushSocketEventsToUser(socket, userID)
            }

            console.log('\t[logged-in]: Wait Queue: ', userIDToWaitQueueMap[userID])
            // userIDToWaitQueueMap[userID] = {}
            initWaitQueue(userID)

            // Inform other users that he is online
            console.log("\tEmitting [online-statuses] to all users")
            io.emit('online-statuses', JSON.stringify(userIDToOnlineStatusMap))
        })

        socket.on('send-message', msgObjectString => {
            console.log(".on(send-message)")
            let msgObject = JSON.parse(msgObjectString)
            console.log("\t[send-message]: Received a new message.", msgObject)
            let { receiverID, id, senderID } = { ...msgObject }

            if (isUserOnline(receiverID)) {
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