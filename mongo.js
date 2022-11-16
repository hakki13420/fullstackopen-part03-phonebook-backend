const mongoose = require('mongoose')


if(process.argv.length<3){
    console.log('error in parameters')
    process.exit(1)
}
const password=process.argv[2]   

const personSchema=mongoose.Schema({
    name:{type:String},
    number:{type:String}
    })

const Person=mongoose.model(
    'Person',
    personSchema
)

const uri=`mongodb+srv://admin:${password}@notesApp.tsvsl.mongodb.net/phonebook?retryWrites=true&w=majority`    
mongoose.connect(uri)
    .then(conn=>console.log('connected to database'))
    .catch(err=>console.log(err))

if(process.argv.length===3){
 Person.find({})
    .then(result=>{
        console.log(result)
        mongoose.connection.close()
    })    
}else if(process.argv.length===5){
    const newPerson=new Person({
        name:process.argv[3],
        number:process.argv[4]
    })
    newPerson.save()
        .then(result=>{
            console.log(result)
            mongoose.connection.close()
        })
        .catch(err=>console.log(err))
}