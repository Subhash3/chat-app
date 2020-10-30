const mongoose = require('mongoose')

mongoose.Promise = global.Promise

let MONGO_URI

const connectToMongoDBAtlas = ({ cluster, username, password, dbname }) => {
    console.log("[SERVER]: Connecting to MongoDB...")
    console.log(JSON.stringify({ cluster, username, password, dbname }))
    MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}.1kbpx.mongodb.net/${dbname}?retryWrites=true&w=majority`

    let mongoConnection = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    mongoose.connection.once('open', () => {
        console.log("[SERVER]: Connected to MongoDB.")
    })

    mongoose.connection.on('error', (err) => {
        console.log("[SERVER]: MongoDB error!", err)
    })

    return mongoConnection
}

module.exports = {
    connectToMongoDBAtlas
}