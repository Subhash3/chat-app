const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    id: String,
})

const User = mongoose.model('users', usersSchema)

module.exports = {
    UsersModel: User
}