const express = require('express')
const { UsersModel } = require('../Models/users')
const { ChatsModel } = require('../Models/chats')

const router = express.Router()
const welcomeMessage = "Welcome to Shine's chat app!"
const mongoError = "Couldn't fetch database!"

const getListOfUsers = async () => {
    let usersList = await UsersModel.find()
    return usersList
}

const getChats = async () => {
    let chats = await ChatsModel.find()
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
    getChats()
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