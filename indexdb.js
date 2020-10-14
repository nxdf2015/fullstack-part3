const express = require("express");
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()


const { response } = require("express");
const { request } = require("http");
//let { persons } = require("./data");
const person = require("./model/phonebook")


const url = "/api/persons";

const port = process.env.PORT || 3001;

// configuration morgan  
// creation token :body to log body of post request
morgan.token("body", (req,resp)=> {
    if (Object.keys(req.body).length ){
        return JSON.stringify(req.body)
    }
    else 
        return ""
}) 


app = express();

app.use(express.static("build"))
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :body"))
app.use(cors())

/**
 * routes
 *  get /api/persons/ 
 *  get /api/persons/:id
 *  post /api/persons/ 
 *  delete/api/persons/:id
 *  
 *  unknow route
 *  error page
 */

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  const personFind = person.find(id)
  .then(result  =>{
  if (result) {
    response.status(200).json(result);
  } else {
    response.status(406).end(`person ${id} not find`);
  }
}
)
});


app.get("/api/persons", (request, response) => {
  person.find({})
    .then(result => {
      response.json(result)
    })
  }
  );

 
  
app.delete("/api/persons/:id",(request,response,next) => {
  const id =  request.params.id
  console.log(id)
  person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.post("/api/persons", (request, response,next) => {
  let data = request.body;
  if (data !=="" && data.name && data.number){
    
    new person(data).save()
      .then(result => response.status(200).redirect("/api/persons") )
    
      .catch(error => console.log(error))
  }
  else {
    next("error request ")
  }

})


app.put("/api/persons/:id",(request,response,next) => {
  let data = request.body
  const id = request.params.id

  person.findByIdAndUpdate(id, data ,{new : true })
    .then(result => response.status(204).redirect("/api/persons"))
    .catch(error => next(error) )
})


const errorHandler = (error,request,response,next) => {
  response.status(404).send({error :error })
}

const unknownEndpoint = (request,response) => {
  response.status(404).send("unknown endpoint")
}


app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(port, () => {
  console.log(`server listen on ${port}  `);
})