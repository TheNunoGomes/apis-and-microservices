const mongoose = require("mongoose");
const dns = require("dns");

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
  dns.lookup(req.body.url.replace(/https?:\/\//, ""), (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }
    URL.findOne({ original_url: req.body.url }, (error, data) => {
      if (error) return console.log(error);
      if (!data) {
        const short_url = Math.floor(Math.random() * 90000) + 10000;
        const original_url = req.body.url;
        const newUrl = new URL({
          short_url,
          original_url,
        });
        newUrl.save((error, data) => {
          if (error) return console.log(error);
          return res.json({
            original_url,
            short_url,
          });
        });
      } else {
        let { short_url, original_url } = data;
        return res.json({
          original_url,
          short_url,
        });
      }
    });
  });
}

function navigateToUrl(req, res) {
  URL.findOne({ short_url: req.params.url }, (error, data) => {
    if (error) return console.log(error);
    console.log(data);
    if (!data) {
      return res.json({ error: "No short URL found for the given input" });
    } else {
      let redirectUrl = data.original_url;

      return res.redirect(redirectUrl);
    }
  });
}

module.exports = {
  getUrlShortenerHTML,
  setShortUrl,
  navigateToUrl,
};
