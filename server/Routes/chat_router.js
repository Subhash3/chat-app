const express = require('express')
const { LearnersModel } = require('../Models/users')
const { ChatsModel } = require('../Models/chats')

const router = express.Router()
const welcomeMessage = "Welcome to Shine's chat app!"
const mongoError = "Couldn't fetch database!"

const getListOfUsers = async () => {
    // let usersList = await LearnersModel.find({}, {
    //     email: true,
    //     name: true
    // })
    let usersList = await LearnersModel.aggregate([
        {
            "$project": {
                "email": true,
                "name": true,
                "id": "$email"
            }
        }
    ])
    return usersList
}

const getChats = async (userID) => {
    let chats = await ChatsModel.find({
        $or: [
            { "senderID": userID },
            { "receiverID": userID }
        ]
    }, {
        _id: false
    })
    return chats
}

const deleteMessages = (messageIDs) => {
    let mongoPromise = ChatsModel.deleteMany({
        'id': {
            '$in': [...messageIDs]
        }
    })
    // db.chats.deleteMany({id: {$in: ["95863fc1-10ca-4755-98b1-68497736fda8", "c30c3467-370a-4108-a3e6-e00466e22ad0"]}} )

    return mongoPromise
}


const deleteWholeConvo = (id1, id2) => {
    let mongoPromise = ChatsModel.deleteMany({
        '$or': [
            {
                '$and': [
                    { "senderID": id1 },
                    { "receiverID": id2 }
                ]
            },
            {
                '$and': [
                    { "senderID": id2 },
                    { "receiverID": id1 }
                ]
            }
        ]
    })
    return mongoPromise
}

router.get('/', (req, res) => {
    res.send({ "msg": welcomeMessage })
})

router.get('/users', (req, res) => {
    getListOfUsers()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            res.send(mongoError + err)
        })
})

router.get('/chats', (req, res) => {
    res.status(403).send("Access denied!")
})

router.get('/chats/:userID', (req, res) => {
    let userID = req.params.userID
    console.log(`Hit! (/chat-app/chats/${userID})`)
    getChats(userID)
        .then(chats => {
            res.send(chats)
        })
        .catch(err => {
            res.send(mongoError + err)
        })
})

router.post('/delete/', (req, res) => {
    let messageIDs = req.body.messageIDs
    console.log(messageIDs)
    // let senderID = req.body.senderID
    let receiverID = req.body.receiverID

    messageIDs.forEach(msgID => {
        console.log("Deleting message with ID: " + msgID)
    })

    let mongoPromise = deleteMessages(messageIDs)
    mongoPromise
        .then((data) => {
            console.log(data)
            res.send({
                message: `Deleted messages`,
                status: 1
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                message: `Failed to delete messages`,
                status: -1
            })
        })

})

router.post('/delete-convo', (req, res) => {
    let { id1, id2 } = req.body.IDs
    let mongoPromise = deleteWholeConvo(id1, id2)
    mongoPromise
        .then((data) => {
            console.log(data)
            res.send({
                message: `Deleted Conversation`,
                status: 1
            })
        })
        .catch(err => {
            console.log(err)
            res.send({
                message: `Failed to delete conversation`,
                status: -1
            })
        })
})

module.exports = {
    chatRouter: router
}