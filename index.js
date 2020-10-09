const { response } = require("express");
const express = require("express");
const { request } = require("http");
let { persons } = require("./data");

const url = "/api/persons";
const port = 3001;
const generateId = () => {
  let id = undefined;
  let ids = persons.map((p) => p.id);
  do {
    id = Math.floor(Math.random() * 10000);
  } while (ids.includes(id));

  return id;
};

app = express();

app.use(express.json());

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  console.log(request.url, id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.status(404).json(person);
  } else {
    response.status(404).end(`person ${id} not find`);
  }
});

app.get("/api/persons", (request, response) => {
  console.log(request.url);
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const message = `phonebook has info for ${persons.length}\n${new Date()}`;
  response.end(message);
});

app.post("/api/persons", (request, response) => {
  let person = request.body;
  if (person.name && person.number) {
    person = { ...person, id: generateId() };
    if (persons.find((p) => p.name === person.name)) {
      persons = [...persons, person];
      response.status(404).json(person);
    } else {
      response.status(404).json({error : "name must be unique"});
    }
  } else {
    const message = `${person.name ? "number" : "name"} is required`;
    response.status(404);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(404).json(persons);
});



app.listen(port, () => {
  console.log(`server listen on ${port}  `);
});
