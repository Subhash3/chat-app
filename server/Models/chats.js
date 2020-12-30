const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatsSchema = new Schema({
    // _id: mongoose.Types.ObjectId,
    id: String,
    senderID: String,
    receiverID: String,
    msgBody: String,
    time: String,
    date: String,
    status: String,
})

const Chat = mongoose.model('chats', chatsSchema)

module.exports = {
    ChatsModel: Chat
}