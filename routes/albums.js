var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');

router.get('/init', function(req, res) {
	if (req.cookies.userID) {
	  	var db = req.db;
		var collection = db.get('userList'); 
		
		collection.find({_id: req.cookies.userID},['username'],function(e,docs){
			collection.find({ $or: [{_id: req.cookies.userID},{friends: docs[0].username}] },['username'],function(e,docs){		// find logged-in user and his/her friends
				res.json(docs);
			});	
		});

	}else{
  		res.send('');
  	}
});

router.post('/login', urlencodedParser, function(req, res) {
	var db = req.db;
	var collection = db.get('userList'); 
	var nameInput = req.body.username;
	var pwInput = req.body.password;
	collection.find({username: nameInput, password: pwInput}, ['username'], function(e,docs){
		if (docs=='') {
			res.send('Login failure');
		} else {
			var milliseconds = 60 * 60 * 1000;
			res.cookie('userID', docs[0]._id, { maxAge: milliseconds });
			collection.find({ $or: [{_id: docs[0]._id},{friends: docs[0].username}] },['username'],function(e,docs){		// find logged-in user and his/her friends
				res.json(docs);
			});	
		}
	})	
});

router.get('/logout', function(req, res){
	res.clearCookie('userID');
	res.send(''); 
});

router.get('/getalbum/:userid', function(req, res){
	var db = req.db;
	var collection = db.get('photoList'); 
	if (req.params.userid=='0') {
		collection.find({userid: req.cookies.userID},['url','likedby'],function(e,docs){
			if(docs!=''){
				res.json(docs);
			}else{
				res.send(e);
			}
		});
	} else {
		collection.find({userid: req.params.userid},['url','likedby'],function(e,docs){
			if(docs!=''){
				res.json(docs);
			}else{
				res.send(e);
			}
		});
	}
});

router.post('/uploadphoto', function(req, res){

	var db = req.db;
	var collection = db.get('photoList'); 
	var d = new Date();
	var num = d.getTime();
	
	var path = './public/uploads/' + num + '.jpg';
	req.pipe(fs.createWriteStream(path)); 
	
	collection.insert({
		url: "uploads/"+num+".jpg",
		userid: req.cookies.userID,
		likedby: []
	}, function(err, result){
		if (err===null) {
	        collection.find({url: "uploads/"+num+".jpg"},['url'],function(e,docs){
				res.json(docs);
			});	
	    } else {
	    	res.send(err);
	    }
    });
})

router.delete('/deletephoto/:photoid', function(req, res){
	var db = req.db;
    var collection = db.get('photoList');
    collection.find({'_id':req.params.photoid},['url'], function(e,docs){
    	fs.unlink('./public/'+docs[0].url);
    	collection.remove({'_id':req.params.photoid}, function(err, result){
	    	res.send((err === null) ? {msg:''} : {msg:err});
	    });
    })
});

router.put('/updatelike/:photoid', function(req, res){
	var db = req.db;
    var collection1 = db.get('userList');
    var collection2 = db.get('photoList');

    collection1.find({_id: req.cookies.userID},['username'],function(e,docs){
		collection2.update(
			{ 
				_id: req.params.photoid 
			}, 
			{ 
				$push: { 
					likedby: docs[0].username 
				}
			}, function(err, result){
		        if (err===null) {
			        collection.find({'_id':req.params.photoid},['likedby'],function(e,docs){
						res.json(docs);
					});	
			    } else {
			    	res.send(err);
			    }
	    	});
	});
});

// to pass the cookie value to getAlbums() because the value cannot be read in myscripts.js
router.get('/cookie', function(req,res){
	if (req.cookies.userID) {
	  	res.send(req.cookies.userID);
	}else{
  		res.send('');
  	}
})

module.exports = router;
