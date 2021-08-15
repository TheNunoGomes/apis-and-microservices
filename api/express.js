
const mySecret = process.env['MESSAGE_STYLE']


function getMethodPathIp(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}

function getExpressHTML(req, res) {
  // res.send("Hello Express");
  let { expressPath } = req;
  res.sendFile(expressPath);
}

function getTime(req, res, next) {
  req.time = new Date().toString();
  next()
}

function showTime (req, res) {
    let {time} = req;
    res.send({ time });
}

function expressJson(req, res) {
  // res.send("Hello Express");
  let response = "Hello json";
  if(process.env.MESSAGE_STYLE === "uppercase") {
    response = "Hello json".toUpperCase();
  }

  res.json({"message": response});
}

function echoWord(req, res) {
  res.json({ "echo": req.params.word })
}

function getName(req, res) {
  res.json({ "name": `${req.query.first} ${req.query.last}` })
}

function postName(req, res) {
  res.json({ "name": `${req.body.first} ${req.body.last}` })
}

module.exports = {
  getMethodPathIp,
  getTime,
  getExpressHTML,
  showTime,
  expressJson,
  echoWord,
  getName,
  postName
};
