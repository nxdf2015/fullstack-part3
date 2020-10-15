const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv").config();

const url_db = process.env.url_phonebook;

mongoose.connection.close();
mongoose
  .connect(url_db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("error connection");
  });

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, unique: true, required: true, minlength: 6 },
});

PersonSchema.plugin(uniqueValidator);

PersonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = new mongoose.model("Person", PersonSchema);
