const express = require('express');
const app = express();
const jade = require('jade');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shipdata";
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req,res){
	res.render('index2.jade');
});

app.post('/quicksearch', urlencodedParser, function (req,res){
	MongoClient.connect(url, function (err, db) {
        let ship_imo = req.body.imo;
        let checked = req.body.checked;
        console.log(req.body);
        if (err) throw err;
        if(checked === "false"){
            db.collection("ship2").find({'IMO': {'$regex': ship_imo}}).limit(4).toArray(function(err, result) {
                if (err) throw err;
                res.send(result);
                res.end();
                db.close();
            });
        }
        else{
            db.collection("ship2").find({'IMO': ship_imo}).limit(5).toArray(function(err, result) {
                if (err) throw err;
                res.send(result);
                res.end();
                db.close();
            });
        }
    });
});

app.post('/search-result', urlencodedParser, function (req,res){
    MongoClient.connect(url, function (err, db) {
        let ship_imo = req.body.IMO;
        if (err) throw err;
        db.collection("ship2").find({'IMO': {'$regex': ship_imo}}).toArray(function(err, results) {
            if (err) throw err;
            res.render('kq.jade', results);
            // res.send(ship_imo);
            res.end();
            db.close();
        });
    });
});

app.post('/ship/view-detail', urlencodedParser, function (req, res) {
    // console.log(req.body);
    MongoClient.connect(url, function(err, db) {
        let ship_imo = req.body.IMO;
        let ship_name = req.body.Name;
        if (err) throw err;
        db.collection("ship2").findOne({'IMO': ship_imo, 'Name': ship_name},function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.render('detail.jade',{result});
            res.end();
            db.close();
        });
    });
});


let server = app.listen(3000, function(){
	console.log("Server is running");
});