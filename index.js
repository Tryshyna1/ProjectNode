var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodeproject');


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;
var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// Make our db accessible to our router
router.use(function(req,res,next){
    req.db = db;
    next();
});

/* GET userlist. */
router.get('/list', function(req, res) {
  var db = req.db;
  var collection = db.get('ticket');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

router.get('/list/:id', function (req, res) {
	  var db = req.db;
	  var collection = db.get('ticket');
      var tickets = JSON.parse( data );
	  var userToList = req.params.id;
	  collection.find({'_id' : userToList }, function(e,docs){
		  res.json(docs);

   });
});

/* POST to Add User Service */
router.post('/addticket', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var ticket = req.body.ticket;
	var type = req.body.type;
    var subject = req.body.subject;
	var description = req.body.description;

    // Set our collection
    var collection = db.get('ticket');

    // Submit to the DB
    collection.insert({
        "ticket" : ticket,
        "type" : type,
		"subject" : subject,
		"description" : description
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }

	});
});





/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ticket');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

app.use('/rest', router);



app.listen(port, function() {
    console.log("Node app is running at localhost:" + port)
  });