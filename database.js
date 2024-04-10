const  {MongoClient } = require('mongodb')
let uri = 'mongodb+srv://sharmakrisha382:Krishna_sharma_db@cluster0.bzjfech.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// mongodb://localhost:27017/book_review (to connect it with local host in our computer replace uri with this url)
let dbConnection

module.exports = { 
    connectToDb : (callback) => {
        MongoClient.connect(uri)
        .then((client) => {
           dbConnection = client.db()
           return callback()
        })
        .catch(err => {
            // console.log("Unable to connect")
            console.log(err)
            return callback(err)
        })
    },
    getDb : () => dbConnection
}