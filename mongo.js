const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

// const password = process.argv[2];
const [, , password, name, number] = process.argv;
const url = `mongodb+srv://{username}:${password}@fullstackopen-helsinki.l7tvqi6.mongodb.net/contactApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const connection = mongoose.connect(url);

if (!name || !number) {
  connection
    .then((result) => {
      console.log('connected');
      return Person.find({});
    })
    .then((persons) => {
      console.log(persons);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  connection
    .then((result) => {
      const person = new Person({
        name,
        number,
      });
      return person.save();
    })
    .then(({ name, number }) => {
      console.log(`Added ${name} ${number} to phone book`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
