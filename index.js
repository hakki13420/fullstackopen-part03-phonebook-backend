require("dotenv").config()
const express = require('express')
const app=express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

let persons=require('./data/data.json')

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token("post",(req,res)=>{
    return JSON.stringify(req.body)        
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


//routes
app.get('/api/persons',(req,res,next)=>{
    Person.find({})
        .then(persons=>res.status(200).json(persons))
        .catch(err=>next(err))
})

app.get('/api/persons/:id',(req,res,next)=>{
   const id=req.params.id
   Person.findById(id)
    .then(person=>{
        if(person) {
            return res.status(200).json(person)
        }
        return res.status(404).json({error:"not found"})
    })
    .catch(err=>{
        next(err)
    })    
})

app.delete('/api/persons/:id',(req,res,next)=>{    
    const id=req.params.id
    console.log('id delete req',id)
    return Person.findByIdAndRemove(id)
        .then(person=>{
            if(person){
                return res.status(204).end()                
            }
            return res.status(404).json({error:"not found"})                
        })
        .catch(err=>next(err))    
})

const getRandomId=()=>{    
    return Math.floor(Math.random()*1000000+1)
}

app.post('/api/persons',(req,res,next)=>{
    const person=req.body    
    //if(person.name && person.number){
        const newPerson=Person({
            name:person.name,
            number:person.number,
        })
        return newPerson.save()
            .then(person=>res.status(201).json(person))
            .catch(err=>next(err))
        
    //}
    //return res.status(400).send({"error":"please you have to fill all data"})
})

app.put('/api/persons/:id',(req,res,next)=>{
    const person=req.body
    
    
        const newPerson={
            name:person.name,
            number:person.number,
        }
        return Person.findByIdAndUpdate(
                req.params.id,
                newPerson,
                { new: true, runValidators: true, context: 'query' }
            )
            .then(personUpdated=>res.json(personUpdated))
            .catch(err=>next(err))        
    
})

app.get('/info',(req,res,next)=>{
    let count=0
    
    Person.find({})
        .then(persons=>{
            count=persons.length
            
            const result=`<div>
                    <p>Phonebook has info for ${count} people</p>
                    <p>${new Date()}</p>
                  </div>
                  `
            return res.status(200).send(result)
        })
        .catch(err=>next(err))
    
})

app.use((req,res)=>{
    return res.status(404).end('not found')
})

//error handler
app.use((error,req,res,next)=>{
    if(error.name==="CastError"){
        return res.status(400).json({error:'bad id in the request'})
    }    
    if(error.name==="ValidationError"){
        console.log('error   ',error)
        return res.status(400).json({error:error.message})
    }
    //next(error)
})


const port = process.env.PORT
app.listen(port,()=>console.log(`server runin on ${port} port`))