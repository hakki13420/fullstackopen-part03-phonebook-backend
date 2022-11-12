const express = require('express')
const app=express()
const morgan = require('morgan')
const cors = require('cors')

let persons=require('./data/data.json')

//middlewares
app.use(cors())
app.use(express.json())

morgan.token("post",(req,res)=>{
    return JSON.stringify(req.body)        
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


//routes
app.get('/api/persons',(req,res)=>{
    //persons=persons.concat({"id":5,"name":"hakki","number":"44444"})
    console.log(persons)
    return res.status(200).json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id)
    
    const person=persons.find(person=>person.id===id)
    if(!person) return res.status(404).json({"error":"error person not fount"})
       
    return res.status(200).json(person)
})

app.delete('/api/persons/:id',(req,res)=>{    
    const id=Number(req.params.id)
    const person=persons.find(person=>person.id===id)
    if(person) {
        persons=persons.filter(person=>person.id!==id)        
        return res.status(204).end()
    }
    return res.status(404).json({"error":"error resource not found"})
})

const getRandomId=()=>{    
    return Math.floor(Math.random()*1000000+1)
}

app.post('/api/persons',(req,res)=>{
    const person=req.body
    if(person.name && person.number){
        const personExist = persons.find(per=>per.name===person.name)
        if(!personExist){
            const id=getRandomId()
            const newPerson={...person, id}
            persons=persons.concat(newPerson)
    
            return res.status(201).json(newPerson)
        }
        return res.status(400).json({ error: 'name must be unique' })
        
    }
    return res.status(400).send({"error":"please you have to fill all data"})
})

app.get('/info',(req,res)=>{
    const count=persons.length
    const result=`<div>
                    <p>Phonebook has info for ${count+1} people</p>
                    <p>${new Date()}</p>
                  </div>
                  `
    return res.status(200).send(result)
})


const port = process.env.PORT || 3001
app.listen(port,()=>console.log(`server runin on ${port} port`))