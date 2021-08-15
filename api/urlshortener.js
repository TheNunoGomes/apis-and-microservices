const shortid = require("shortid");
const mongoose = require("mongoose");

/* 
  The approach:
  const personSchema = new mongoose.Schema({...})
  would also work
*/
const { Schema } = mongoose;
const url = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true },
});

const URL = mongoose.model("URL", url);

function getUrlShortenerHTML(req, res) {
  res.sendFile(process.cwd() + "/views/urlshortener.html");
}

function setShortUrl(req, res) {
  URL.findOne({ original_url: req.body.url }, (error, data) => {
    if (error) return console.log(error);
    if (!data) {
      const short_url = shortid.generate();
      const original_url = req.body.url;
      const newUrl = new URL({
        short_url,
        original_url,
      });

      newUrl.save((error, data) => {
        if (error) return console.log(error);
        res.json({
          original_url,
          short_url,
        });
      });
    } else {
      let { short_url, original_url } = data;
      res.json({
        original_url,
        short_url,
      });
    }
  });
}

function navigateToUrl(req, res) {
  URL.findOne({ short_url: req.params.url }, (error, data) => {
    if (error) return console.log(error);
    console.log(data);
    if (!data) {
      res.json({ error: "No short URL found for the given input" });
    } else {
      res.redirect(data.original_url);
    }
  });
}

module.exports = {
  getUrlShortenerHTML,
  setShortUrl,
  navigateToUrl,
};
