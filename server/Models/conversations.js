const mongoose = require('mongoose')
const MONGO_URI = "mongodb+srv://Shine:shine@mongodb@cluster0.1kbpx.mongodb.net/<dbname>?retryWrites=true&w=majority"
const conversationsSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    id: String,
})