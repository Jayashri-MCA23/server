const express=require('express')
const mongoose = require('mongoose')
const dotenv=require('dotenv').config()
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()
app.use(cors())
app.use(express.json())
const PORT=process.env.PORT
const URL=process.env.URL

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',function(req,res){
    res.setHeader("Access-Control-Allow-Credentials","true")
    res.send("Welcome")
})
app.get('/data',function(req,res){
    Data.find().then((item)=>res.send(item))
})
app.post('/create',function(req,res){
    Data.create(req.body).then((item)=>res.send(item))

})
app.post('/login', function(req, res) {
    const { email, password } = req.body;
    Data.findOne({ email, password }).then((item) => {
        if(item) {
            
            res.send(item);
        } else {
            res.status(404).send("User not found");
        }
    });
});

app.put('/deposit/:id', function(req, res) {
    const id= req.params.id;
    const deposit =req.body.amount;

    Data.findByIdAndUpdate({_id:id},{ $set:{amount: deposit }},{ new: true })
        .then((updatedItem) => {
            if (updatedItem) {
                res.send(updatedItem);
            } else {
                res.status(404).send("Item not found");
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});
app.put('/withdraw/:id',function(req, res) {
    const id = req.params.id;
    const withdraw = req.body.amount;

    Data.findByIdAndUpdate({_id:id},{ $set:{ amount:withdraw }},{ new: true })
        .then((updatedItem)=>{
            if (updatedItem) {
                res.send(updatedItem);
            } else {
                res.status(404).send("Item not found");
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

app.delete('/delete/:id', function (req, res) {
    const id = req.params.id;
  
    Data.findByIdAndDelete(id)
      .then((deletedItem) => {
        if (deletedItem) {
          res.send({success: true, message: 'User deleted successfully' });
        } else {
          res.status(404).send({ success: false,message: 'User not found' });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  });


app.listen(PORT,() => {
    console.log('Server running 8080')
})
mongoose.connect(URL).then(console.log('MongoDB connected'))
//create a schema
var newSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    amount:Number
})
//data modeling
let Data=mongoose.model('mca',newSchema)
//create a data for testing
// let data1=new Data({
//     name:'Jayashri',
//     email:'jayashrimurugaiyan10@gmail.com',
//     password:'jayashri',
//     amount:1000

// })
// //save
// data1.save()