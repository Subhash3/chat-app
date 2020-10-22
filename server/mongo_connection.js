const mongoose = require('mongoose')

let MONGO_URI

const connectToMongoDBAtlas = ({ cluster, username, password, dbname }) => {
    MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}.1kbpx.mongodb.net/${dbname}?retryWrites=true&w=majority`

    let mongoConnection = mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    mongoose.connection.once('open', () => {
        console.log("Connected to MongoDB.")
    })

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB error!", err)
    })

    return mongoConnection
}

module.exports = {
    connectToMongoDBAtlas
}