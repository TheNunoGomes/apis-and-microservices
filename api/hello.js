function hello(req, res) {
    res.json({greeting: 'hello API'});
}

module.exports = {
    hello
}