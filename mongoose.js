var express = require('express');
var app= express();

var assert = require('assert');
var bodyParser = require('body-parser');
const { resolveInclude } = require('ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs');

// taking images, custom css and javascript files
app.use(express.static('public'))
var mongoose = require('mongoose');
const res = require('express/lib/response');

// const uri = "mongodb+srv://m001-student:FrePen313@sandbox.srxs4qj.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://m001-student:FrePen313@sandbox.srxs4qj.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var itemsSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    dob: String,
    email: String,
    city: String,
    age: Number
});

var Record = mongoose.model('std_infos', itemsSchema);

app.get('/', function (req, res){
    Record.find({}, function(err, data){
        console.log(data);
        res.render('pages/index_mongoose', {data: data});
      
    })
})

app.post('/', function (req, res){
    console.log(req.body);
    var item = new Record({
        firstname: req.body.first_name,
        lastname: req.body.last_name,
        dob: req.body.birth_date,
        email: req.body.emailid,
        city: req.body.city,
        age: 15
    });
    item.save();
    res.render('pages/index_mongoose', {data: []})
})



app.post('/insert-bulk-records', function(req, res){
    var data = [
        {'firstname': 'Parita', 'lastname': 'Dabhi', 'dob': '16-Jan-1990', 'email': 'p@gmail.com', 'city':'Glasgow'},
        {'firstname': 'Steven', 'lastname': 'Perry', 'dob': '01-Jan-1985', 'email': 's@gmail.com', 'city':'Stirling'},
        {'firstname': 'Asha', 'lastname': 'Jyoti', 'dob': '16-Jan-1977', 'email': 'a@gmail.com', 'city':'Glasgow'},
        {'firstname': 'David', 'lastname': 'Clark', 'dob': '16-Jan-1987', 'email': 'd@gmail.com', 'city':'Paris'},
        {'firstname': 'Ashvini', 'lastname': 'Chavan', 'dob': '11-Mar-1999', 'email': 'as@gmail.com', 'city':'New York'}
    ]
    Record.insertMany(data).then(function(){
        console.log("Data inserted")
        res.send({'result': 'ok'})
    }).catch(function(error){
        console.log(error)
        res.send({'result': 'error'})
    });
});

app.post('/update', function(req, res){
    Record.findByIdAndUpdate("62fccb757cbebf15399d44cb", {city: "Vancouver"},
    function(err, data){
        console.log(data);
        res.send("ok");
    } )
})

app.get('/delete', function(req, res){
    Record.findByIdAndRemove("62fcd2240441592083b5d763",
    function(err, data){
        console.log(data);
        res.send("ok");
    } )
})

app.get('/greater-than-age', function(req, res){
    Record.findOneAndUpdate({age: {$gte:12} },
         {firstname: "Anuj", lastname: "Anuj"}, null, function (err, docs) {
             if (err){
                 console.log(err);
                 res.send(err);
             } else {
                console.log("Original Doc :" ,docs);
                res.send("ok");
             } 
    });
});

app.get('/greater-than-age-del', function(req, res){
    Record.findOneAndRemove({age: {$gte:11} }, function (err, docs) {
             if (err){
                 console.log(err);
                 res.send(err);
             } else {
                console.log("Original Doc :" ,docs);
                res.send("ok");
             } 
    });
});




app.listen(5000);
console.log('Server is listening on port 5000')