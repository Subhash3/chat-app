const express = require('express')

const router = express.Router()
const welcomeMessage = "Welcome to Shine's chat app!"

router.get('/', (req, res) => {
    res.send({ "msg": welcomeMessage })
})

module.exports = {
    chatRouter: router
}