require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const SOME = process.env.TEST_VAR;

console.log('PORT IS:', process.env.PORT);
console.log('TEST_VAR:', SOME);
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

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  return Math.floor(Math.random() * (100000 - 1 + 1) + 1);
};

const checkDuplicate = (name) => {
  return persons.find((p) => p.name.toLowerCase() === name.toLowerCase());
};

app.post('/api/persons', (req, res) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).send({ error: 'Name and Number is required' });
  }
  if (checkDuplicate(body.name)) {
    return res.status(400).send({ error: 'Name must be unique' });
  }
  const personId = generateId();
  body.id = personId;
  persons.push(body);
  return res.status(201).send(persons);
});

app.get('/api/persons', (req, res) => {
  return res.status(200).json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((p) => p.id === +req.params.id);
  if (!person) return res.status(404).end();
  return res.status(200).json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const deletionIdx = persons.findIndex((p) => p.id === +req.params.id);
  if (deletionIdx > -1) {
    persons.splice(deletionIdx, 1);
    return res.status(200).json(persons);
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
