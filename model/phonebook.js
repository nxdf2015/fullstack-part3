const mongoose = require("mongoose")
require("dotenv").config()

const url_db = process.env.url_phonebook
console.log(process.env)
console.log(url_db)
mongoose.connection.close()
mongoose.connect(url_db,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then( () => {
        console.log("connected to database")
    })
    .catch(error => {
        console.log("error connection")
    })


const PersonSchema = new mongoose.Schema({
    name:String,
    number:String
})

PersonSchema.set("toJSON",{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

module.exports = new mongoose.model("Person",PersonSchema)