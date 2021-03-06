const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { response } = require("express");
const { request } = require("http");
let { persons } = require("./data");
//const personModel = require("./phonebook.js")

const url = "/api/persons";

const port = process.env.PORT || 3001;

// generate a unique id
const generateId = () => {
  let id = undefined;
  let ids = persons.map((p) => p.id);
  do {
    id = Math.floor(Math.random() * 10000);
  } while (ids.includes(id));

  return id;
};

// configuration morgan
// creation token :body to log body of post request
morgan.token("body", (req, resp) => {
  if (Object.keys(req.body).length) {
    return JSON.stringify(req.body);
  } else return "";
});

app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
);
app.use(cors());

/**
 * routes
 *  get /api/persons/
 *  get /api/persons/:id
 *  post /api/persons/
 *  delete/api/persons/:id
 *
 */

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.status(200).json(person);
  } else {
    response.status(406).end(`person ${id} not find`);
  }
});

app.get("/api/persons", (request, response) => response.json(persons));

app.get("/api/info", (request, response) => {
  const message = `phonebook has info for ${persons.length}\n${new Date()}`;
  response.end(message);
});

app.post("/api/persons", (request, response) => {
  let person = request.body;
  if (person.name && person.number) {
    person = { ...person, id: generateId() };

    if (
      persons.every((p) => p.name.toLowerCase() !== person.name.toLowerCase())
    ) {
      persons = [...persons, person];
      response.status(200).json(person);
    } else {
      response.status(200).json({ error: "name must be unique" });
    }
  } else {
    const message = `${person.name ? "number" : "name"} is required`;
    response.status(200).end(message);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(200).json(persons);
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.map((person) =>
    person.id === id ? { ...request.body, id } : person
  );
  console.log(persons);
  response.status(200).json(persons);
});

app.use((request, response) => response.status(404).end("error page"));

app.listen(port, () => {
  console.log(`server listen on ${port}  `);
});
