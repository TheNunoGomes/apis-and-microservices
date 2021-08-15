// Packages
const express = require("express");
const dns = require("dns");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Libraries
const Hello = require("./api/hello");
const Express = require("./api/express");
const Timestamp = require("./api/timestamp");
const HeaderParser = require("./api/headerparser");
const UrlShortener = require("./api/urlshortener");

// Set server port
const PORT = process.env.PORT | 3000;

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

const router = express.Router();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use("/.netlify/dist", router);
app.use(express.static("styles"));
app.use("/styles", express.static(`${__dirname}/styles`));
app.use("/styles", express.static(`${process.cwd()}/styles`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use(Express.getMethodPathIp);

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Hello
router.get("/hello", Hello.hello);

// Express Tutorial
router.get(
  "/express",
  (req, res, next) => {
    req.expressPath = `${__dirname}/views/express.html`;
    next();
  },
  Express.getExpressHTML
);
router.get("/express/now", Express.getTime, Express.showTime);

router.get("/express/json", Express.expressJson);
router.get("/express/:word/echo", Express.echoWord);

router.get("/express/name", Express.getName);

router.post("/express/name", Express.postName);

// Timestamp Microservice
router.get(
  "/timestamp",
  (req, res, next) => {
    req.timestampPath = `${__dirname}/views/timestamp.html`;
    next();
  },
  Timestamp.getTimestampHTML
);

router.get("/timestamp/api", Timestamp.getNowTime);

router.get("/timestamp/api/:date", Timestamp.getDateObject);

// Header Parser Microservice
router.get(
  "/header-parser",
  (req, res, next) => {
    req.headerParserPath = `${__dirname}/views/headerparser.html`;
    next();
  },
  HeaderParser.getHeaderParserHTML
);

router.get("/header-parser/api/whoami", HeaderParser.getWhoAmI);

// URL Shortener Microservice
router.get(
  "/url-shortener",
  (req, res, next) => {
    req.urlShortenerPath = `${__dirname}/views/urlshortener.html`;
    next();
  },
  UrlShortener.getUrlShortenerHTML
);

router.get("/url-shortener/api/shorturl/:url", UrlShortener.navigateToUrl);

router.post("/url-shortener/api/shorturl", UrlShortener.setShortUrl);

// listen for requests
var listener = app.listen(PORT, function () {
  console.log("The app is listening on port " + listener.address().port);
});
