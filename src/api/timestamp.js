function getTimestampHTML(req, res) {
    let { timestampPath } = req
  res.sendFile(timestampPath);
}

function getNowTime(req, res) {
    const date = new Date();
    res.json(
        {
        unix: date.getTime(),
            utc: date.toUTCString()
        }
    )
}

function getDateObject(req, res) {
  
  const numbersRegex = /^\d+$/
  const paramInUnix = numbersRegex.test(req.params.date)
  let date
  if(paramInUnix)
    date = new Date(Number(req.params.date))
  else date = new Date(req.params.date);

  if(date.toString() === 'Invalid Date')
    res.json({ error : "Invalid Date" })

  res.json(
    {
      unix: date.getTime(),
      utc: date.toUTCString()
    }
  )
}

module.exports = {
    getNowTime,
    getDateObject,
    getTimestampHTML
}