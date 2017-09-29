require('localenv');
const express = require ('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parse');
const { MongoClient } = require('mongodb');
const path = require('path');

MongoClient.connect(process.env.URL_CONNECT, (db Error, db) =>{
	const router = require('./routers/router.js')
})