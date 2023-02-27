const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();

// Module calling
const {MongoClient} = require("mongodb");

// Server path
const url = 'mongodb://localhost:27017/';

client =   new MongoClient(url)

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.json())

app.use(cors())

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
  });


app.post("/login",async (req, res) => {
    console.log("entered")
    var password = req.body.user.password;
    console.log(req.body.user.email)
    console.log(req.body.user.password)
   
    const result = await client.db("Stock-Management-System").collection("User").find({"email": req.body.user.email,"password": req.body.user.password}).toArray();
    console.log(result)

    if (result.length === 0){
        res.end("user is not found")
    }

    else if(result[0].password === password) {
        res.end("password is right")
    } else {
        res.end("password is wrong")
    }
});


app.post("/register",async (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var email = req.body.email;
    var gender = req.body.gender;
    var phonenumber = req.body.phonenumber;
    
    client.db("Stock-Management-System").collection("User").insertMany([{"firstname": firstname,"lastname": lastname,"password": password,"email":email,"gender":gender,"phonenumber":phonenumber}]);


    //  console.log(result)


});


app.get("/stock/:gender/:dresstype", async(req, res) => {
    console.log(req.params)
    const result = await client.db("Stock-Management-System").collection("Stock").find({gender: req.params.gender,dresstype: req.params.dresstype}).toArray();
    res.end( JSON.stringify(result));
})

app.post("/addstock", async(req, res) => {
    var gender = req.body.gender;
    var dresstype = req.body.dresstype;
    var dressname = req.body.dressname;
    var size = req.body.size;
    var quantity = req.body.quantity;
    var price = req.body.price;

    
    client.db("Stock-Management-System").collection("Stock").insertMany([{"gender": gender,"dresstype": dresstype,"dressname": dressname,"size":size,"quantity":quantity,"price":price}]);

});

app.get("/stock/:gender", async(req, res) => {
    console.log(req.params)
    const result = await client.db("Stock-Management-System").collection("Stock").find({gender: req.params.gender}, { dresstype:1, _id:0 }).toArray();
    res.end( JSON.stringify(result));
})




app.listen(3000,function(){
    console.log("sever is running on 3000")
})
