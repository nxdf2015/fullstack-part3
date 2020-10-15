const mongoose = require("mongoose");
const length = process.argv.length;

if (process.argv.length < 2) {
  console.log("password required");
  process.exit();
}

const password = process.argv[2];

const url_db = `mongodb+srv://admin:${password}@cluster0.llwdf.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const Person = new mongoose.Schema({
  name: String,
  number: String,
});

let person = new mongoose.model("Person", Person);

switch (length) {
  case 3:
    // get all persons in the phonebook
    person.find({}).then((result) => {
      console.log("phonebook");
      result.forEach(({ name, number }) => {
        console.log(`${name}:${number}`);
      });
      mongoose.connection.close();
    });
    break;
  case 5:
    // add a person to the phonebook

    let name = process.argv[3];
    let number = process.argv[4];
    let newPerson = new person({
      name,
      number,
    });

    newPerson.save().then(({ name, number }) => {
      console.log(`add ${name}:${number} to phonebook`);
      mongoose.connection.close();
    });
}
