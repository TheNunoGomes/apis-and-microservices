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

const urlSchema = new mongoose.Schema({
  url: String,
});

const Url = mongoose.model("Url", urlSchema);

function getUrlShortenerHTML(req, res) {
  res.sendFile(process.cwd() + "/views/urlshortener.html");
}

function setShortUrl(req, res) {
  const urlbody = new URL("/", req.body.url);
  dns.lookup(urlbody.hostname, (err, address) => {
    if (err || !address) {
      return res.json({ error: "invalid url" });
    }
    const newUrl = new Url({ url: urlbody });
    newUrl
      .save()
      .then((doc) => {
        console.log("successfully shortened");
        return res.json({ original_url: urlbody, short_url: doc._id });
      })
      .catch((err) => console.log(err));
  });
}

function navigateToUrl(req, res) {
  const urlId = req.params.id;
  Url.findById(urlId)
    .then((data) => {
      if (!data) {
        return res.json({ error: "invalid url" });
      }
      return res.redirect(data.url);
    })
    .catch((err) => console.log(err));
}

module.exports = {
  getUrlShortenerHTML,
  setShortUrl,
  navigateToUrl,
};
