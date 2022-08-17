var express = require('express');
var app= express();
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var bodyParser = require('body-parser');
const { resolveInclude } = require('ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs');

// taking images, custom css and javascript files
app.use(express.static('public'))

// mongodb configuration
// var url_mongodb = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4'
// const uri = "mongodb+srv://parita:parita1690@cluster0.z3dqww1.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://m001-student:FrePen313@sandbox.srxs4qj.mongodb.net/?retryWrites=true&w=majority";

// database Name
var dbName = 'CRUD_Nodejs'


//Basic syntax to connect with MongoDb server and database
// var client = new MongoClient(url_mongodb);
// client.connect()
//   .then(client => {
//     const db = client.db(dbName);
//   }).catch(error => console.log(error))


var client = new MongoClient(uri);
client.connect()
  .then(client => {
    console.log('MongoDB server is connected successfully.')
    const db = client.db(dbName);
    const students_info = db.collection('students_info')

    // use res.render to load up an ejs view files
    //index page
    app.get('/', function(req, res){
      console.log('inside / get api')
      //Static Data
      var tagline = 'Static Data'
      var data = [
        {'first_name': 'Parita', 'last_name': 'Dabhi', 'birth_date': '16-Jan-1990', 'emailid': 'p@gmail.com', 'address':'Glasgow'},
        {'first_name': 'Steven', 'last_name': 'Perry', 'birth_date': '01-Jan-1985', 'emailid': 's@gmail.com', 'address':'Stirling'},
        {'first_name': 'Asha', 'last_name': 'Jyoti', 'birth_date': '16-Jan-1977', 'emailid': 'a@gmail.com', 'address':'Glasgow'},
        {'first_name': 'David', 'last_name': 'Clark', 'birth_date': '16-Jan-1987', 'emailid': 'd@gmail.com', 'address':'Paris'},
        {'first_name': 'Ashvini', 'last_name': 'Chavan', 'birth_date': '11-Mar-1999', 'emailid': 'as@gmail.com', 'address':'New York'}
      ]
      console.log(data.length);
      // Data from DB (Dynamic) - read data from DB
      db.collection("students_info").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result.length);
        if(result.length >= 1){
          res.render('pages/index', {
            std_data_static: data,
            tagline: tagline,
            std_db_data: result
          });
        }else{
          res.render('pages/index', {
            std_data_static: data,
            tagline: tagline,
            std_db_data: result
          });
        }
      });
    });

    // registeration page
    app.get('/register', function(req, res){
      console.log('inside / get api for register')
      // res.render('pages/register')
      res.render('pages/register', {
        message: ''
      });
    });


    // operations page
    app.get('/api/update-delete', function(req, res){
      console.log('inside / add del api for register')
      // res.render('pages/register')
      res.render('pages/operations', {
        message: '',
        message_delete: '',
        message_update: ''
      });
    });


    // add data into database
    app.post('/register', function(req, res){
      console.log('inside / post api for register')
      console.log(req.body);

      // Custom _id in MongoDB document
      // req.body['_id'] = 1;
      // console.log(req.body);

      // 1st Method to store data into DB
      // db.collection("students_info").insertOne(req.body, function(err, res) {
      //   if (err) throw err;
      //   console.log("1 document inserted");
           // console.log(res);
      // });


      // 2nd Method to store data into DB with catch
      students_info.insertOne(req.body).then(result => {
          console.log(result);
          if(result.acknowledged == true){
            res.render('pages/register', {
              message: 'success'
            });
          }else{
            res.render('pages/register', {
              message: 'error'
            });
          }
      })
      .catch(error => console.log(error))
    });



    app.post('/update', function(req, res){
      console.log('inside / add update api for register');
      console.log(req.body)
      var myquery = { first_name: req.body.first_name };
      var newvalues = { $set: req.body };
      db.collection("students_info").updateOne(myquery, newvalues, function(err, obj) {
        if (err) throw err;
        console.log(obj);
        if(obj.acknowledged == true && obj.modifiedCount != 0 && obj.matchedCount >= 1){
          res.render('pages/operations', {
            message_update: 'success',
            message_delete: ''
          });
        }else if(obj.acknowledged == true && obj.modifiedCount == 0 && obj.matchedCount >= 1){
          res.render('pages/operations', {
            message_update: 'DataMatched_NothingtoModify',
            message_delete: ''
          });
        }else if(obj.acknowledged == true && obj.modifiedCount == 0 && obj.matchedCount == 0){
          res.render('pages/operations', {
            message_update: 'DataNotMatched_NothingtoModify',
            message_delete: ''
          });
        }else{
          res.render('pages/operations', {
            message_update: 'error',
            message_delete: ''
          });
        }
      });
    });



    app.post('/delete', function(req, res){
      console.log('inside / delete api for register');
      var myquery = { first_name: req.body.first_name };
      db.collection("students_info").deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log(obj);

        if(obj.acknowledged == true && obj.deletedCount != 0){
          res.render('pages/operations', {
            message_delete: 'success',
            message_update: ''
          });
        }else if(obj.acknowledged == true && obj.deletedCount == 0){
          res.render('pages/operations', {
            message_delete: 'no data',
            message_update: ''
          });
        }else{
          res.render('pages/operations', {
            message_delete: 'error',
            message_update:''
          });
        }
      });
    });

    app.post('/search-by-name', function(req, res){
      console.log('inside / search api by name');
      var query = {first_name: req.body.fname}
      // var query = {first_name: "Steven"}
      db.collection("students_info").findOne(query, function(err, result) {
        if (err) throw err;
        console.log(result);
        if (result == null){
          res.send([]);
        } else {
        res.send(result);
        }
      });
    })

    // app.post('/search-by-name', function(req, res){
    //   console.log('inside / search api by name');
    // })


    var port_number = process.env.PORT || 3000;
    app.listen(port_number);
    console.log('Server is listening on port 3001')

}).catch(error => console.log(error))
