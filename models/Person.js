const mongoose = require('mongoose')

//connexion

mongoose.connect(process.env.URI_MONGODB)
    .then(conn=>console.log('database connected'))
    .catch(err=>console.log(err))


//model
const personSchema= mongoose.Schema({
    name:{
      type:String,
      minLength:3,
      required:[true,"le nom est indisponsble"]
    },
    number:{
      type:String,
      minLenght:8,
      validate:{        
        validator:(value)=>{
          return /\d{2,3}-\d{5,6}/.test(value)
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required:[true, 'youn have to input the phone number']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person=mongoose.model('Person', personSchema)

module.exports=Person