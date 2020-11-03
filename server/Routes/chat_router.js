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
    })
    return chats
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

module.exports = {
    chatRouter: router
}