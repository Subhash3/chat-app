const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const connectToMongoDBAtlas = (URI, someMsg) => {
    console.log("[SERVER]: Connecting to MongoDB...: ", someMsg)

    let mongoConnection = mongoose.connect(URI, {
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