const express = require('express');
const app = express();
const jade = require('jade');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shipdata";
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var coll;

app.get('/', function (req,res){
	res.render('index.jade');
});

MongoClient.connect(url, function(err,db){
    if (err) throw err;
    coll = db.collection('ship2');
})

app.post('/quicksearch', urlencodedParser, function (req,res){	
    let ship_imo = req.body.imo;
    let checked = req.body.checked;
    if(checked === "false"){
        coll.find({'IMO': {'$regex': ship_imo}}).limit(4).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            res.end();
        });
    }
    else{
        coll.find({'IMO': ship_imo}).limit(4).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            res.end();
        });
    }
});

app.get('/search-result', urlencodedParser, function (req,res){
    
        let ship_imo = req.query.IMO;
        
        coll.find({'IMO': {'$regex': ship_imo}}).toArray(function(err, results) {
            if (err) throw err;
            res.render('kq.jade', {results});
            res.end();
        });    
});

app.get('/ship/view-detail', urlencodedParser, function (req, res) {
    
        let ship_imo = req.query.IMO;
        let ship_name = req.query.Name;
        
        coll.findOne({'IMO': ship_imo, 'Name': ship_name},function(err, result) {
            if (err) throw err;
            res.render('detail.jade',{result});
            res.end();
        });    
});


let server = app.listen(3000, function(){
	console.log("Server is running");
});