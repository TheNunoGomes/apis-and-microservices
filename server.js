// Packages
const express = require('express');
const dns = require("dns");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Libraries
const Hello = require('./api/hello');
const Express = require('./api/express');
const Timestamp = require('./api/timestamp');
const HeaderParser = require('./api/headerparser');
const UrlShortener = require('./api/urlshortener');

// Set server port
const PORT = process.env.PORT | 3000

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('styles'));
app.use('/styles', express.static(`${__dirname}/styles`))
app.use('/styles', express.static(`${process.cwd()}/styles`));

app.use(Express.getMethodPathIp)

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Hello
app.get("/hello", Hello.hello);

// Express Tutorial
app.get('/express', (req, res, next) => {
  req.expressPath = `${__dirname}/views/express.html`;
  next()
}, Express.getExpressHTML);
app.get('/express/now', Express.getTime, Express.showTime);


app.get('/express/json', Express.expressJson);
app.get('/express/:word/echo', Express.echoWord);

app.get('/express/name', Express.getName)

app.post('/express/name', Express.postName)

// Timestamp Microservice
app.get("/timestamp", (req, res, next) => { 
  req.timestampPath = `${__dirname}/views/timestamp.html`;
  next();
}, Timestamp.getTimestampHTML);

app.get("/timestamp/api", Timestamp.getNowTime);

app.get("/timestamp/api/:date", Timestamp.getDateObject);

// Header Parser Microservice
app.get("/header-parser", (req, res, next) => { 
  req.headerParserPath = `${__dirname}/views/headerparser.html`;
  next();
}, HeaderParser.getHeaderParserHTML);

app.get("/header-parser/api/whoami", HeaderParser.getWhoAmI);


// URL Shortener Microservice
app.get("/url-shortener", (req, res, next) => { 
  req.urlShortenerPath = `${__dirname}/views/urlshortener.html`;
  next();
}, UrlShortener.getUrlShortenerHTML);

app.post('/url-shortener/api/shorturl', UrlShortener.shortenUrl)

// listen for requests
var listener = app.listen(PORT, function () {
  console.log('The app is listening on port ' + listener.address().port);
});
