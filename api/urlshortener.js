function getUrlShortenerHTML(req, res) {
  res.sendFile(process.cwd() + '/views/urlshortener.html');
};

function shortenUrl(req, res) {
	console.log("Post Request")
	console.log(req.params)

    res.json({
        success: true
    });
    // const { url }  = req.body;
    // dns.lookup(url, (err, addresses) => res.json({ original_url: url, short_url: err}))
};

module.exports = {
    getUrlShortenerHTML,
    shortenUrl
}