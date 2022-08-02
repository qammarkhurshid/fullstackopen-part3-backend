require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Phonebook = require('./models/phonebook');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', function (req, res) {
  return JSON.stringify(req['body']);
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens['body'](req, res),
    ].join(' ');
  })
);

const checkDuplicate = async (name) => {
  const persons = await Phonebook.find({ name });
  return persons.length !== 0;
};

app.post('/api/persons', async (req, res) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).send({ error: 'Name and Number is required' });
  }
  const person = new Phonebook({
    name: body.name,
    number: body.number,
  });
  await person.save();
  return res.status(201).send(person);
});

app.get('/api/persons', async (req, res) => {
  const persons = await Phonebook.find({});
  return res.status(200).json(persons);
});

app.get('/api/persons/:id', async (req, res) => {
  const person = await Phonebook.findOne({ _id: req.params.id });
  if (!person) return res.status(404).end();
  return res.status(200).json(person);
});

app.delete('/api/persons/:id', async (req, res) => {
  const person = await Phonebook.findOne({ _id: req.params.id });
  if (person) {
    await Phonebook.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json(person);
  }
  return res.status(204).end();
});

app.get('/info', (req, res) => {
  const response = `<div>
  <p>
  Phonebook has info for ${persons.length} people
  </p>
  <p>
  ${new Date()}
  </p>
  </div>`;
  return res.status(200).send(response);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
